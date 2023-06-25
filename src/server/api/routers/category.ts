import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedAdminProcedure,
} from "~/server/api/trpc";
import { zodName } from "~/server/types/name";

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        cursor: z.string().uuid().optional(),
        limit: z.number().min(1).max(100).nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await ctx.prisma.category.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        include: { _count: { select: { products: true } } },
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

  get: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.category.findUnique({
        where: { id: input.id },
        include: { _count: { select: { products: true } } },
      });
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
