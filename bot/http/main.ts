// Run:
// deno run -A bot/http/main.ts

import { postgres, serve } from "./deps.ts";

import { PgStorer } from "../../storer/pg/mod.ts";
import { mustEnv } from "../env/mod.ts";
import { APP_PERKS } from "../env/app/mod.ts";
import { perks } from "../env/providers/mod.ts";
import { Registry } from "../../perks/provider/registry/mod.ts";
import { overwrite } from "../client/client.ts";
import { Engine } from "../../perks/engine/mod.ts";
import { DefaultHandler } from "./handler/default/handler.ts";

// Retrieve the required environment variables.
const env = mustEnv();

// Create a database pool with three connections that are lazily established.
const pool = new postgres.Pool(env.databaseURL, 3, true);

// Implement Storer class.
const store = new PgStorer(pool);

// Create tables if they don't exist.
await store.createTables();

// Create a Perks provider registry.
const registry = new Registry(perks);

// Create a Perks engine.
const engine = new Engine(store, registry);

// Overwrite the Discord Application Command.
overwrite({ ...env, app: APP_PERKS });

// Create a new handler.
const handler = new DefaultHandler(engine, env.publicKey);

serve(async (r: Request) => {
  // Handle the request.
  return await handler.handle(r);
});
