import type { RESTPostAPIApplicationCommandsJSONBody } from "../deps.ts";
import { contentType } from "../deps.ts";

const DISCORD_API_URL = "https://discord.com/api/v8";

interface RegisterInit {
  botID: string;
  botToken: string;
  app: RESTPostAPIApplicationCommandsJSONBody;
}

/**
 * overwrite overwrites the Discord Slash Commands associated with this server.
 *
 * Based on this cURL command:
 * ```bash
 * BOT_TOKEN='replace_me_with_bot_token'
 * CLIENT_ID='replace_me_with_client_id'
 * curl -X POST \
 * -H 'Content-Type: application/json' \
 * -H "Authorization: Bot $BOT_TOKEN" \
 * -d '{"name":"hello","description":"Greet a person","options":[{"name":"name","description":"The name of the person","type":3,"required":true}]}' \
 * "https://discord.com/api/v8/applications/$CLIENT_ID/commands"
 * ```
 */
export async function overwrite(
  { botID, botToken, app }: RegisterInit,
): Promise<Response> {
  const url = makeRegisterGuildCommandsURL(botID);
  const r = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": contentType("json"),
      "Authorization": makeBotAuthorization(botToken),
    },
    body: JSON.stringify(app),
  });
  if (!r.ok) {
    console.error(JSON.stringify(await r.json(), null, 2));
    throw new Error(
      `Failed to overwrite Discord Slash Commands: ${r.status} ${r.statusText}`,
    );
  }

  return r;
}

function makeRegisterGuildCommandsURL(
  clientID: string,
  base = DISCORD_API_URL,
) {
  return new URL(`${base}/applications/${clientID}/commands`);
}

function makeBotAuthorization(botToken: string) {
  return botToken.startsWith("Bot ") ? botToken : `Bot ${botToken}`;
}
