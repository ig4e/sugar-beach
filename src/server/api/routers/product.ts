import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedAdminProcedure,
} from "~/server/api/trpc";
import { zodName } from "~/server/types/name";
import { utapi } from "uploadthing/server";
import { mediaSchema } from "~/server/commonZod";
import { TRPCError } from "@trpc/server";

import type { Prisma } from "@prisma/client";
import { MAX_PAGE_SIZE, PAGE_SIZE } from "../config";

const productInput = z.object({
  media: mediaSchema.array().min(1),
  name: zodName,
  description: z.object({
    ar: z.string().optional(),
    en: z.string().optional(),
  }),
  price: z.number(),
  compareAtPrice: z.number().optional(),
  quantity: z.number(),
  categoryIDs: z.string().uuid().array(),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]),
  type: z.string(),
});

export const productRouter = createTRPCRouter({
  getCart: protectedProcedure
    .input(z.object({ productIDs: z.string().uuid().array() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.product.findMany({
        where: { id: { in: input.productIDs } },
        take: 1000,
      });
    }),

  similarProducts: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.id },
      });

      if (!product) throw new TRPCError({ code: "NOT_FOUND" });

      const similarProducts = await ctx.prisma.product.findMany({
        where: {
          categoryIDs: { hasSome: product.categoryIDs },
        },
        take: 8,
        include: {
          categories: true,
        },
      });

      return similarProducts;
    }),

  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().positive().max(MAX_PAGE_SIZE).default(PAGE_SIZE),
        cursor: z.number().positive().default(1),
        searchQuery: z.string().nullish(),
        categoryIDs: z.string().uuid().array().nullish(),
        status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).default("ACTIVE"),
        orderBy: z
          .object({
            key: z.enum(["id", "price", "createdAt", "updatedAt", "visits"]),
            type: z.enum(["asc", "desc"]),
          })
          .default({ key: "id", type: "asc" }),
        productIDs: z.string().uuid().array().nullish(),
        minPrice: z.number().nullish(),
        maxPrice: z.number().nullish(),
        onSale: z.boolean().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? PAGE_SIZE;

      const query = input.searchQuery
        ? ((await ctx.prisma.product.aggregateRaw({
            pipeline: [
              {
                $search: {
                  index: "productSearch",
                  text: {
                    query: input.searchQuery,
                    path: ["name.ar", "name.en"],
                  },
                },
              },
              {
                $limit: limit,
              },
              { $project: { _id: 1 } },
            ],
          })) as unknown as { _id: string }[])
        : undefined;

      const filter: Prisma.ProductWhereInput = {
        id: query
          ? { in: query.map((item) => item._id) }
          : input.productIDs
          ? { in: input.productIDs }
          : undefined,
        categoryIDs: input.categoryIDs
          ? { hasEvery: input.categoryIDs }
          : undefined,
        status: input.status ? { equals: input.status } : undefined,
        price: { gte: input.minPrice ?? 0, lte: input.maxPrice ?? undefined },
        compareAtPrice: input.onSale ? { gt: 0 } : undefined,
      };

      const itemsCount = await ctx.prisma.product.count({
        where: filter,
      });

      const totalPages = Math.ceil(itemsCount / input.limit);
      const offset = (input.cursor - 1) * input.cursor;

      let items = await ctx.prisma.product.findMany({
        where: filter,
        orderBy: input.orderBy
          ? {
              [input.orderBy.key]: input.orderBy.type,
            }
          : {
              id: "asc",
            },
        skip: offset,
        take: limit,
        include: {
          categories: true,
        },
      });

      const productPriceAggregate = await ctx.prisma.product.aggregate({
        where: filter,
        _min: { price: true },
        _max: { price: true },
      });

      const meta = {
        totalCount: itemsCount,
        priceRange: {
          max: productPriceAggregate._max.price,
          min: productPriceAggregate._min.price,
        },
      };

      if (query) {
        const sortedItems = query
          .map(({ _id }) => items.find((item) => item.id === _id))
          .filter((item) => !!item === true) as typeof items;
        items = sortedItems;
      }

      return {
        meta,
        nextCursor: totalPages > input.cursor ? input.cursor + 1 : undefined,
        prevCursor: input.cursor > 1 ? input.cursor - 1 : undefined,
        totalPages,
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
      return ctx.prisma.product.findUnique({
        where: { id: input.id },
        include: {
          categories: true,
        },
      });
    }),

  visit: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.product.update({
        where: { id: input.id },
        data: { visits: { increment: 1 } },
      });
    }),

  create: protectedAdminProcedure
    .input(productInput)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.product.create({
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          compareAtPrice: input.compareAtPrice,
          quantity: input.quantity,
          media: input.media,
          categoryIDs: input.categoryIDs,
          status: input.status,
          type: input.type,
        },
      });
    }),

  edit: protectedAdminProcedure
    .input(productInput.extend({ id: z.string().uuid() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.product.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          compareAtPrice: input.compareAtPrice,
          quantity: input.quantity,
          media: input.media,
          categoryIDs: input.categoryIDs,
          status: input.status,
        },
      });
    }),

  delete: protectedAdminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deletedProduct = await ctx.prisma.product.delete({
        where: { id: input.id },
      });

      try {
        await utapi.deleteFiles(deletedProduct.media.map((media) => media.key));
      } catch {}

      return deletedProduct;
    }),
});
