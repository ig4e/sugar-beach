import { TRPCError } from "@trpc/server";
import { z } from "zod";
import ChangeEmail from "~/email/templates/verification/ChangeEmail";
import {
  createTRPCRouter,
  protectedAdminProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { resend } from "~/server/resend";
import { addressRouter } from "./address";

import { utapi } from "uploadthing/server";
import { v4 } from "uuid";

export const userRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid().nullish(),
        email: z.string().email().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id ? input.id : undefined,
          email: input.email ? input.email : undefined,
        },
      });

      if (!user)
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      return user;
    }),

  getStaff: protectedAdminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().uuid().optional(),
        excludeIDs: z.array(z.string().uuid()).nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await ctx.prisma.user.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        where: {
          role: { in: ["ADMIN", "STAFF"] },
          id: input.excludeIDs ? { notIn: input.excludeIDs } : undefined,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        if (nextItem) nextCursor = nextItem.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getLinkedPlatforms: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const userWithLinkedPlatforms = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { accounts: { select: { createdAt: true, provider: true } } },
      });

      if (!userWithLinkedPlatforms)
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      return userWithLinkedPlatforms.accounts;
    }),

  address: addressRouter,

  edit: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.name)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No changes were provided",
        });

      const user = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
        },
      });

      return user;
    }),

  editRole: protectedAdminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        role: z.enum(["ADMIN", "STAFF", "USER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN")
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action",
        });

      if (ctx.session.user.id === input.id)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action",
        });

      const user = await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          role: input.role,
        },
      });

      return user;
    }),

  updateUserAvatar: protectedProcedure
    .input(z.object({ url: z.string(), key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user)
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });

      try {
        if (user.media) await utapi.deleteFiles([user.media.key]);
      } catch {}

      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          media: {
            isVideo: false,
            key: input.key,
            name: `${user.name}-avatar`,
            url: input.url,
            size: 4,
          },
        },
      });

      return updatedUser;
    }),

  sendEmailChangeVerification: protectedProcedure.mutation(async ({ ctx }) => {
    const code = v4().substring(0, 4);
    const userEmail = ctx.session.user.email;

    try {
      await ctx.prisma.verificationCode.create({
        data: {
          code,
          identifier: userEmail,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });

      const data = await resend.emails.send({
        from: "no-reply@wolflandrp.xyz",
        to: [userEmail],
        subject: "Verify your email",
        react: ChangeEmail({ code: code }),
      });

      return {
        id: data.id,
        message: "Email sent",
      };
    } catch (error) {
      console.log(error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),

  updateUserEmail: protectedProcedure
    .input(z.object({ code: z.string(), newEmail: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const isCodeCorrect = await ctx.prisma.verificationCode.findFirst({
        where: {
          identifier: ctx.session.user.email,
          code: { equals: input.code },
          expires: { gt: new Date() },
        },
      });

      if (!isCodeCorrect)
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid code" });

      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          email: input.newEmail,
        },
      });
    }),
});
