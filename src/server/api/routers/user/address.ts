import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedAdminProcedure,
} from "~/server/api/trpc";

const addressInput = z.object({
  fullName: z.string(),
  phoneNumber: z.object({ code: z.string(), number: z.string() }),
  type: z.enum(["HOME", "OFFICE"]),
  country: z.enum(["BH", "KW", "OM", "QA", "SA", "AE"]),
  streetName: z.string(),
  buildingNumber: z.string(),
  city: z.string(),
  // area: z.string(),
  province: z.string(),
  nearestLandmark: z.string(),
});

export const addressRouter = createTRPCRouter({
  findMany: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    return await ctx.prisma.userShippingAddress.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),

  create: protectedProcedure
    .input(addressInput)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.userShippingAddress.create({
        data: {
          fullName: input.fullName,
          phoneNumber: input.phoneNumber,
          type: input.type,
          country: input.country,
          streetName: input.streetName,
          buildingNumber: input.buildingNumber,
          city: input.city,
          //area: input.area,
          province: input.province,
          nearestLandmark: input.nearestLandmark,
          userId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(addressInput.extend({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const address = await ctx.prisma.userShippingAddress.findUnique({
        where: { id: input.id },
      });

      if (!address) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Address not found",
        });
      }

      if (address.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to update this address",
        });
      }

      return await ctx.prisma.userShippingAddress.update({
        where: { id: input.id },
        data: {
          fullName: input.fullName,
          phoneNumber: input.phoneNumber,
          type: input.type,
          country: input.country,
          streetName: input.streetName,
          buildingNumber: input.buildingNumber,
          city: input.city,
          //area: input.area,
          province: input.province,
          nearestLandmark: input.nearestLandmark,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const address = await ctx.prisma.userShippingAddress.findUnique({
        where: { id: input.id },
      });

      if (!address) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Address not found",
        });
      }

      if (address.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to update this address",
        });
      }

      return await ctx.prisma.userShippingAddress.delete({
        where: { id: input.id },
      });
    }),
});
