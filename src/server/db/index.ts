import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ?? "postgres://silkroad:silkroad@localhost:5432/silkroad";

declare global {
  // eslint-disable-next-line no-var
  var __silkroad_pg__: ReturnType<typeof postgres> | undefined;
}

const client = global.__silkroad_pg__ ?? postgres(connectionString, { max: 10 });
if (process.env.NODE_ENV !== "production") global.__silkroad_pg__ = client;

export const db = drizzle(client, { schema });
export type Db = typeof db;
export { schema };
