import type {
  APIApplicationCommandInteractionDataSubcommandOption,
  APIChatInputApplicationCommandInteraction,
  APIInteractionResponse,
} from "../../../deps.ts";
import { ApplicationCommandOptionType } from "../../../deps.ts";

import type { Engine, UseRequest } from "../../../../perks/engine/mod.ts";
import {
  MINT,
  MINT_MAX_USES,
  MINT_MILLISECONDS,
} from "../../../env/app/sub/mint.ts";
import { UNMINT, UNMINT_MINT_ID } from "../../../env/app/sub/unmint.ts";
import {
  AWARD,
  AWARD_MEMBER,
  AWARD_MINT_ID,
} from "../../../env/app/sub/award.ts";
import { REVOKE, REVOKE_AWARD_ID } from "../../../env/app/sub/revoke.ts";
import { LIST, LIST_AWARD_MEMBER } from "../../../env/app/sub/list.ts";
import { USE, USE_MINT_ID, USE_QUERY } from "../../../env/app/sub/use.ts";
import {
  makeAwardInteractionResponse,
  makeErrorInteractionResponse,
  makeListInteractionResponse,
  makeMintInteractionResponse,
  makeRevokeInteractionResponse,
  makeUnmintInteractionResponse,
} from "./responses.ts";

export async function handle(
  engine: Engine,
  interaction: APIChatInputApplicationCommandInteraction,
): Promise<APIInteractionResponse> {
  if (!interaction.data.options || interaction.data.options.length === 0) {
    throw new Error("No options provided");
  }

  const { 0: { name, type } } = interaction.data.options;
  if (type !== ApplicationCommandOptionType.Subcommand) {
    throw new Error("Invalid option type");
  }

  if (!interaction.member) {
    console.log({ interaction });
    throw new Error("No user provided");
  }

  const { 0: { options } } = (interaction.data
    .options as APIApplicationCommandInteractionDataSubcommandOption[]);

  switch (name) {
    case MINT: {
      const result = await engine.mint({
        type: name,
        minter: interaction.member.user.id,
        max_uses: Number(
          options?.find((o) => o.name === MINT_MAX_USES)?.value,
        ),
        milliseconds: Number(
          options?.find((o) => o.name === MINT_MILLISECONDS)?.value,
        ),
      });

      return makeMintInteractionResponse(result);
    }

    case UNMINT: {
      const id = options?.find((o) => o.name === UNMINT_MINT_ID)?.value;
      if (!id) {
        throw new Error("No ID provided");
      }

      const result = await engine.unmint({ id: String(id) });
      return makeUnmintInteractionResponse(result);
    }

    case AWARD: {
      const id = options?.find((o) => o.name === AWARD_MINT_ID)?.value;
      if (!id) {
        throw new Error("No ID provided");
      }

      const awardee = options?.find((o) => o.name === AWARD_MEMBER)?.value;
      if (!awardee) {
        throw new Error("No member provided");
      }

      const result = await engine.award({
        mint_id: String(id),
        awarder: interaction.user?.id ?? "0",
        awardee: String(awardee),
      });
      return makeAwardInteractionResponse(result);
    }

    case REVOKE: {
      const id = options?.find((o) => o.name === REVOKE_AWARD_ID)?.value;
      if (!id) {
        throw new Error("No ID provided");
      }

      const result = await engine.revoke({ award_id: String(id) });
      return makeRevokeInteractionResponse(result);
    }

    case LIST: {
      const id = options?.find((o) => o.name === LIST_AWARD_MEMBER)?.value;
      const request = id ? { awardee: String(id) } : {};
      const result = await engine.list(request);
      return makeListInteractionResponse(result);
    }

    case USE: {
      const id = options?.find((o) => o.name === USE_MINT_ID)?.value;
      if (!id) {
        throw new Error("No name provided");
      }

      const request: UseRequest = { mint_id: String(id) };
      const query = options?.find((o) => o.name === USE_QUERY)?.value;
      if (query) {
        request.query = String(query);
      }

      const result = await engine.use(request);
      return result.data;
    }

    default: {
      return makeErrorInteractionResponse("Invalid command. Please try again.");
    }
  }
}
