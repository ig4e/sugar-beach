import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedAdminProcedure,
} from "~/server/api/trpc";
import { mediaSchema } from "~/server/commonZod";
import { zodName } from "~/server/types/name";

export const featuredRouter = createTRPCRouter({
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

      const items = await ctx.prisma.featured.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
        include: { product: true },
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
      return ctx.prisma.featured.findUnique({
        where: { id: input.id },
        include: { product: true },
      });
    }),

  create: protectedAdminProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        media: mediaSchema.array().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.featured.create({
        data: { productId: input.productId, media: input.media },
      });
    }),

  edit: protectedAdminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        productId: z.string().uuid(),
        media: mediaSchema.array().min(1),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.featured.update({
        where: { id: input.id },
        data: { productId: input.productId, media: input.media },
      });
    }),

  delete: protectedAdminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.featured.delete({ where: { id: input.id } });
    }),
});
