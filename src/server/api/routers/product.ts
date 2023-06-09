import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedAdminProcedure,
} from "~/server/api/trpc";
import { zodName } from "~/server/types/name";

const productInput = z.object({
  media: z.string().array(),
  name: zodName,
  description: z.object({
    ar: z.string().optional(),
    en: z.string().optional(),
  }),
  price: z.number(),
  compareAtPrice: z.number().optional(),
  quantity: z.number(),
  categoryIDs: z.string().array(),
  status: z.enum(["ACTIVE", "DRAFT"]),
  type: z.string(),
});

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany();
  }),

  get: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.product.findUnique({ where: { id: input.id } });
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
    .mutation(({ ctx, input }) => {
      return ctx.prisma.product.delete({ where: { id: input.id } });
    }),
});
