import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../trpc";
import { users } from "@/server/db/schema";

export const authRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await ctx.db
      .select({
        id: users.id,
        phone: users.phone,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, ctx.user.sub));

    if (!user) return null;
    return user;
  }),
});
