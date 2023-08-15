import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedAdminProcedure,
} from "~/server/api/trpc";

export const invoiceRouter = createTRPCRouter({
  createInvoice: protectedProcedure
    .input(
      z.object({
        orderId: z.string().uuid(),
        provider: z.enum(["MYFATOORAH", "TABBY", "TAMARA"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const order = await ctx.prisma.order.findUnique({
        where: { id: input.orderId },
        include: {
          invoice: true,
          products: true,
          shippingAddress: true,
          user: true,
        },
      });

      if (!order)
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });

      if (order.invoice)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Invoice already created",
        });

        

    }),
});

