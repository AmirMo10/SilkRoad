import { router } from "./trpc";
import { productsRouter } from "./routers/products.router";
import { categoriesRouter } from "./routers/categories.router";

export const appRouter = router({
  products: productsRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
