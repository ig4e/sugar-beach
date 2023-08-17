import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedAdminProcedure,
} from "~/server/api/trpc";
import { zodName } from "~/server/types/name";
import { MAX_PAGE_SIZE, PAGE_SIZE } from "../config";

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        cursor: z.number().positive().default(1),
        limit: z.number().min(1).max(MAX_PAGE_SIZE).default(PAGE_SIZE),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;

      const itemsCount = await ctx.prisma.category.count({});

      const totalPages = Math.ceil(itemsCount / input.limit);
      const offset = (input.cursor - 1) * input.cursor;

      const items = await ctx.prisma.category.findMany({
        take: limit,
        orderBy: {
          id: "asc",
        },
        include: { _count: { select: { products: true } } },
        skip: offset,
      });

      return {
        totalPages,
        nextCursor: totalPages > input.cursor ? input.cursor + 1 : undefined,
        prevCursor: input.cursor > 1 ? input.cursor - 1 : undefined,
        items,
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
