import { router } from "./trpc";
import { productsRouter } from "./routers/products.router";
import { categoriesRouter } from "./routers/categories.router";
import { authRouter } from "./routers/auth.router";
import { adminRouter } from "./routers/admin.router";
import { ordersRouter } from "./routers/orders.router";

export const appRouter = router({
  auth: authRouter,
  admin: adminRouter,
  products: productsRouter,
  categories: categoriesRouter,
  orders: ordersRouter,
});

export type AppRouter = typeof appRouter;
