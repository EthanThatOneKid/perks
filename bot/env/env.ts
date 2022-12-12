import "https://deno.land/std@0.167.0/dotenv/load.ts";

export const ENV = {
  // Required environment variables.
  publicKey: Deno.env.get("PUBLIC_KEY") || "",
  guildID: Deno.env.get("GUILD_ID") || "",
  botID: Deno.env.get("BOT_ID") || "",
  botToken: Deno.env.get("BOT_TOKEN") || "",
  databaseURL: Deno.env.get("DATABASE_URL") || "",
  databasePass: Deno.env.get("DATABASE_PASS") || "",

  // Optional environment variables.
  registerPath: Deno.env.get("REGISTER_PATH") || "/__register",
} as const;

export type Env = typeof ENV;

export function mustEnv(): Env {
  for (const [key, value] of Object.entries(ENV)) {
    if (value === "") {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  return ENV;
}
