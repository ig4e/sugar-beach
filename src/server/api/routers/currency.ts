import axios from "axios";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { baseUrl } from "../root";

const HALF_DAY_IN_MS = 12 * 60 * 60 * 1000;

export const currencyRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    let rates = await ctx.prisma.currencyRates.findUnique({
      where: {
        id: "_currency",
      },
    });

    if (!rates) return;

    const isOld =
      new Date().getTime() - rates.updatedAt.getTime() > HALF_DAY_IN_MS;

    if (isOld) {
      await axios.get(
        `${baseUrl}/api/currency?key=2550af54-960a-4101-83a4-3e866da2eb87`
      );

      rates = await ctx.prisma.currencyRates.findUnique({
        where: {
          id: "_currency",
        },
      });
    }

    return rates;
  }),
});
