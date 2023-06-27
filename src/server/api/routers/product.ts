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

  getAll: publicProcedure
    .input(
      z.object({
        cursor: z.string().uuid().optional(),
        limit: z.number().min(1).max(100).nullish(),
        searchQuery: z.string().nullish(),
        categoryIDs: z.string().uuid().array().nullish(),
        status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).nullish(),
        orderBy: z
          .object({
            key: z.enum(["name", "price", "createdAt", "editedAt"]),
            type: z.enum(["asc", "desc"]),
          })
          .nullish(),
        productIDs: z.string().uuid().array().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 25;
      const { cursor } = input;

      const query = input.searchQuery
        ? ((await ctx.prisma.product.aggregateRaw({
            pipeline: [
              {
                $search: {
                  index: "productSearch",
                  text: {
                    query: input.searchQuery,
                    path: { wildcard: "*" },
                    fuzzy: {},
                  },
                },
              },
              {
                $limit: limit,
              },
              { $project: { _id: 1 } },
            ],
          })) as any as { _id: string }[])
        : undefined;

      let items = await ctx.prisma.product.findMany({
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: input.orderBy
          ? {
              [input.orderBy.key]: input.orderBy.type,
            }
          : {
              id: "asc",
            },
        where: {
          id: query
            ? { in: query.map((item) => item._id) }
            : input.productIDs
            ? { in: input.productIDs }
            : undefined,
          categoryIDs: input.categoryIDs
            ? { hasEvery: input.categoryIDs }
            : undefined,
          status: input.status ? { equals: input.status } : undefined,
        },
        include: {
          categories: true,
        },
      });

      if (query) {
        const sortedItems = query
          .map(({ _id }) => items.find((item) => item.id === _id))
          .filter((item) => !!item === true) as typeof items;
        items = sortedItems;
      }

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
