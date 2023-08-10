import { createTRPCRouter } from "~/server/api/trpc";
import { categoryRouter } from "~/server/api/routers/category";
import { productRouter } from "~/server/api/routers/product";
import { mediaRouter } from "~/server/api/routers/media";
import { discountRouter } from "~/server/api/routers/discount";
import { featuredRouter } from "~/server/api/routers/featured";
import { feedbackRouter } from "~/server/api/routers/feedback";
import { userRouter } from "~/server/api/routers/user/user";
import { orderRouter } from "~/server/api/routers/order";
import { currencyRouter } from "~/server/api/routers/currency";
import { env } from "~/env.mjs";
import { invoiceRouter } from "~/server/api/routers/invoice";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  category: categoryRouter,
  product: productRouter,
  media: mediaRouter,
  discount: discountRouter,
  featured: featuredRouter,
  feedback: feedbackRouter,
  user: userRouter,
  order: orderRouter,
  currency: currencyRouter,
  invoice: invoiceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export const baseUrl = env.VERCEL_URL
  ? `https://${env.VERCEL_URL}`
  : "http://localhost:3000";
