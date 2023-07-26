import {
    createTRPCRouter,
    publicProcedure
} from "~/server/api/trpc";


export const currencyRouter = createTRPCRouter({
  get: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.currencyRates.findUnique({
      where: {
        id: "_currency",
      },
    });
  }),
});
