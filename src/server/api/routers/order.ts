import { Prisma, Product } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import axios, { AxiosError } from "axios";
import currency from "currency.js";
import { v4 } from "uuid";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedAdminProcedure,
} from "~/server/api/trpc";

export const orderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        shippingAddressId: z.string(),
        additionalNotes: z.string().nullish(),
        products: z
          .object({ id: z.string().uuid(), quantity: z.number().positive() })
          .array(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.session;

      const shippingAddress = await ctx.prisma.userShippingAddress.findFirst({
        where: { userId: user.id },
      });

      if (!shippingAddress)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Shipping address not found",
        });

      if (shippingAddress.userId !== user.id)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Shipping address not found",
        });

      //const errors = [];

      const products = await ctx.prisma.product.findMany({
        where: {
          id: { in: input.products.map((product) => product.id) },
        },
      });

      const orderProducts: (Prisma.ProductOnOrderCreateManyOrderInput & {
        data: Product;
      })[] = [];

      let totalPrice = currency(0);

      for (const product of input.products) {
        const orderProduct = products.find((p) => p.id === product.id);

        if (!orderProduct) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Product not found",
          });
        }

        if (product.quantity > orderProduct.quantity)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `${product.id} has ${orderProduct.quantity} in stock`,
            cause: "Quantity is too high",
          });

        totalPrice = totalPrice
          .add(orderProduct.price)
          .multiply(product.quantity);

        orderProducts.push({
          data: orderProduct,
          compareAtPrice: orderProduct.compareAtPrice,
          price: orderProduct.price,
          productId: product.id,
          quantity: product.quantity,
        });
      }

      const orderId = v4();

      const invoiceRequest = await axios({
        url: "https://apitest.myfatoorah.com/v2/SendPayment",
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization:
            "Bearer " +
            "rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSJ5kK4WLMvYr7sCwHbHcu4A5WwelxYK0GMJy37bNAarSJDFQsJ2ZvJjvMDmfWwDVFEVe_5tOomfVNt6bOg9mexbGjMrnHBnKnZR1vQbBtQieDlQepzTZMuQrSuKn-t5XZM7V6fCW7oP-uXGX-sMOajeX65JOf6XVpk29DP6ro8WTAflCDANC193yof8-f5_EYY-3hXhJj7RBXmizDpneEQDSaSz5sFk0sV5qPcARJ9zGG73vuGFyenjPPmtDtXtpx35A-BVcOSBYVIWe9kndG3nclfefjKEuZ3m4jL9Gg1h2JBvmXSMYiZtp9MR5I6pvbvylU_PP5xJFSjVTIz7IQSjcVGO41npnwIxRXNRxFOdIUHn0tjQ-7LwvEcTXyPsHXcMD8WtgBh-wxR8aKX7WPSsT1O8d8reb2aR7K3rkV3K82K_0OgawImEpwSvp9MNKynEAJQS6ZHe_J_l77652xwPNxMRTMASk1ZsJL", //env.MYFATOORAH_API_KEY,
          "Content-Type": "application/json",
        },
        data: {
          NotificationOption: "LNK",
          CustomerName: user.name.substring(0, 10),
          DisplayCurrencyIso: "KWD",
          MobileCountryCode: shippingAddress.phoneNumber.code,
          CustomerMobile: shippingAddress.phoneNumber.number.substring(0, 11),
          CustomerEmail: user.email,
          InvoiceValue: totalPrice.value,
          CallBackUrl: "http://localhost:3000/api/invoice",
          ErrorUrl: "http://localhost:3000/api/invoice",
          CustomerReference: orderId,
          CustomerAddress: {
            Block: shippingAddress.buildingNumber,
            Street: shippingAddress.streetName,
            HouseBuildingNo: shippingAddress.buildingNumber,
            Address: `${shippingAddress.buildingNumber} ${
              shippingAddress.streetName
            } ${shippingAddress.nearestLandmark || ""} ${
              shippingAddress.city
            }  ${shippingAddress.country}`,
            AddressInstructions: input.additionalNotes,
          },

          InvoiceItems: orderProducts.map((product) => ({
            ItemName: product.data.name.en,
            Quantity: product.quantity,
            UnitPrice: product.price,
          })),
        },
      });

      if (!invoiceRequest.data) return;
      const invoiceData = invoiceRequest.data as unknown as InvoiceResponse;

      const order = await ctx.prisma.order.create({
        data: {
          id: orderId,
          status: "ORDER_PLACED",
          products: {
            createMany: {
              data: orderProducts.map((product) => ({ ...product, data: undefined })),
            },
          },
          user: { connect: { id: user.id } },
          shippingAddress: { connect: { id: input.shippingAddressId } },
          invoice: {
            create: {
              invoiceId: String(invoiceData.Data.InvoiceId),
              url: invoiceData.Data.InvoiceURL,
            },
          },
        },
        include: {
            invoice: true
        }
      });

      return order;
    }),
});

type InvoiceResponse = {
  IsSuccess: boolean;
  Message: string;
  ValidationErrors: any;
  Data: {
    InvoiceId: string;
    InvoiceURL: string;
    CustomerReference: string;
    UserDefinedField: string;
  };
};
