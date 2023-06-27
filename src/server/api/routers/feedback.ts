import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedAdminProcedure,
} from "~/server/api/trpc";

export const feedbackRouter = createTRPCRouter({
  getProductFeedbacks: publicProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        cursor: z.string().uuid().optional(),
        limit: z.number().min(1).max(100).nullish(),
        excludeUserIDs: z.array(z.string().uuid()).nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await ctx.prisma.userFeedback.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        where: {
          productId: input.productId,
          userId: input.excludeUserIDs
            ? { notIn: input.excludeUserIDs }
            : undefined,
        },
        include: { user: true },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getUserProductFeeback: protectedProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const userFeedback = await ctx.prisma.userFeedback.findFirst({
        where: { productId: input.productId, userId: user.id },
        include: { user: true },
      });

      return userFeedback;
    }),

  postProductFeedback: protectedProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        content: z.string(),
        score: z.number().min(0).max(5),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const userAlreadyFeedbacked = await ctx.prisma.userFeedback.count({
        where: { productId: input.productId, userId: user.id },
      });

      if (userAlreadyFeedbacked)
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already feedbacked this product",
        });

      return ctx.prisma.userFeedback.create({
        data: {
          content: input.content,
          score: input.score,
          productId: input.productId,
          userId: user.id,
        },
      });
    }),

  editProductFeedback: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        content: z.string(),
        score: z.number().min(0).max(5),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const feedback = await ctx.prisma.userFeedback.findUnique({
        where: { id: input.id },
      });

      if (!feedback)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Feedback not found",
        });

      if (feedback.userId !== user.id)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't edit this feedback",
        });

      return ctx.prisma.userFeedback.update({
        where: { id: input.id },
        data: {
          content: input.content,
          score: input.score,
        },
      });
    }),

  deleteProductFeedback: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const feedback = await ctx.prisma.userFeedback.findUnique({
        where: { id: input.id },
      });

      if (!feedback)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Feedback not found",
        });

      if (feedback.userId !== user.id)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't delete this feedback",
        });

      return ctx.prisma.userFeedback.delete({ where: { id: input.id } });
    }),
});
