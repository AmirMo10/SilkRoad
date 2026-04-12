import { router } from "./trpc";
import { productsRouter } from "./routers/products.router";
import { categoriesRouter } from "./routers/categories.router";
import { authRouter } from "./routers/auth.router";

export const appRouter = router({
  auth: authRouter,
  products: productsRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
