import { utapi } from "uploadthing/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedAdminProcedure,
} from "~/server/api/trpc";
import { mediaSchema } from "~/server/commonZod";
import { zodName } from "~/server/types/name";
import { MAX_PAGE_SIZE, PAGE_SIZE } from "../config";

export const featuredRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().positive().max(MAX_PAGE_SIZE).default(PAGE_SIZE),
        cursor: z.number().positive().default(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const itemsCount = await ctx.prisma.featured.count({});

      const totalPages = Math.ceil(itemsCount / input.limit);
      const offset = (input.cursor - 1) * input.cursor;

      const items = await ctx.prisma.featured.findMany({
        take: limit, // get an extra item at the end which we'll use as next cursor
        orderBy: {
          id: "asc",
        },
        include: { product: true },
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
    .mutation(async ({ ctx, input }) => {
      const deletedFeatured = await ctx.prisma.featured.delete({
        where: { id: input.id },
      });

      try {
        await utapi.deleteFiles(
          deletedFeatured.media.map((media) => media.key)
        );
      } catch {}

      return deletedFeatured;
    }),
});
