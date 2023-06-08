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

  get: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.category.findUnique({ where: { id: input.id } });
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

  edit: protectedAdminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: zodName,
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.category.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),

  delete: protectedAdminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.category.delete({ where: { id: input.id } });
    }),
});
