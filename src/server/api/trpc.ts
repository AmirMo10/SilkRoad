import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "@/server/db";
import { verifyAccessToken, type AccessTokenPayload } from "@/lib/auth/jwt";

export interface Context {
  db: typeof db;
  user: AccessTokenPayload | null;
  headers: Headers;
}

export async function createContext({ headers }: { headers: Headers }): Promise<Context> {
  let user: AccessTokenPayload | null = null;
  const auth = headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    try {
      user = await verifyAccessToken(auth.slice(7));
    } catch {
      // ignore — user stays null
    }
  }
  return { db, user, headers };
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
  if (ctx.user.role !== "platform_admin" && ctx.user.role !== "company_admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
