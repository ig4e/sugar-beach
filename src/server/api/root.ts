import { createTRPCRouter } from "~/server/api/trpc";
import { categoryRouter } from "./routers/category";
import { productRouter } from "./routers/product";
import { mediaRouter } from "./routers/media";
import { discountRouter } from "./routers/discount";
import { featuredRouter } from "./routers/featured";
import { feedbackRouter } from "./routers/feedback";
import { userRouter } from "./routers/user/user";
import { orderRouter } from "./routers/order";
import { currencyRouter } from "./routers/currency";
import { env } from "~/env.mjs";

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
});

// export type definition of API
export type AppRouter = typeof appRouter;
export const baseUrl = env.VERCEL_URL
  ? `https://${env.VERCEL_URL}`
  : "http://localhost:3000";
