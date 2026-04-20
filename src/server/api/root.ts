import { router } from "./trpc";
import { productsRouter } from "./routers/products.router";
import { categoriesRouter } from "./routers/categories.router";
import { authRouter } from "./routers/auth.router";
import { adminRouter } from "./routers/admin.router";
import { ordersRouter } from "./routers/orders.router";
import { paymentsRouter } from "./routers/payments.router";
import { shipmentsRouter } from "./routers/shipments.router";

export const appRouter = router({
  auth: authRouter,
  admin: adminRouter,
  products: productsRouter,
  categories: categoriesRouter,
  orders: ordersRouter,
  payments: paymentsRouter,
  shipments: shipmentsRouter,
});

export type AppRouter = typeof appRouter;
