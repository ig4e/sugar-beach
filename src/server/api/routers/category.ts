import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedAdminProcedure,
} from "~/server/api/trpc";
import { zodName } from "~/server/types/name";

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany();
  }),

  create: protectedAdminProcedure
    .input(
      z.object({
        name: zodName,
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.category.create({
        data: { name: input.name },
      });
    }),
});
