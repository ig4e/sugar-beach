import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedAdminProcedure,
} from "~/server/api/trpc";
import { addressRouter } from "./address";

export const userRouter = createTRPCRouter({
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
});
