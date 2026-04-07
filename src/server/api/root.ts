import { router } from "./trpc";
import { productsRouter } from "./routers/products.router";

export const appRouter = router({
  products: productsRouter,
});

export type AppRouter = typeof appRouter;
