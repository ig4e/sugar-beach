import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedAdminProcedure,
} from "~/server/api/trpc";

import { utapi } from "uploadthing/server";

const discountInput = z.object({
  code: z.string(),
  precentage: z.number().optional(),
  fixedAmount: z.number().optional(),
  expiresAt: z.date(),
  type: z.enum(["AMOUNT_OFF_ORDER"]).default("AMOUNT_OFF_ORDER"),
});

export const discountRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.discount.findMany();
  }),

  create: protectedAdminProcedure
    .input(discountInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.discount.create({
        data: {
          code: input.code,
          fixedAmount: input.fixedAmount || undefined,
          precentage: input.precentage || undefined,
          expiresAt: input.expiresAt,
          type: input.type,
        },
      });
    }),

  edit: protectedAdminProcedure
    .input(discountInput.extend({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.discount.update({
        where: {
          id: input.id,
        },
        data: {
          code: input.code,
          fixedAmount: input.fixedAmount || undefined,
          precentage: input.precentage || undefined,
          expiresAt: input.expiresAt,
          type: input.type,
        },
      });
    }),

  delete: protectedAdminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.discount.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
