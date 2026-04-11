import "server-only";
import { headers } from "next/headers";
import { appRouter } from "./root";
import { createContext } from "./trpc";

/**
 * Create a tRPC caller for use inside React Server Components.
 * This avoids the HTTP round-trip when a server component needs data.
 */
export async function getServerTrpc() {
  const h = await headers();
  const ctx = await createContext({ headers: new Headers(h) });
  return appRouter.createCaller(ctx);
}
