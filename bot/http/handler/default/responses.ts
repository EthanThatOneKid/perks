import type { APIInteractionResponse } from "../../../deps.ts";
import { InteractionResponseType } from "../../../deps.ts";

import type {
  AwardResponse,
  ListResponse,
  MintResponse,
  RevokeResponse,
  UnmintResponse,
} from "../../../../perks/engine/mod.ts";

export function makeMintInteractionResponse(
  r: MintResponse,
): APIInteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `Minted ${r.type} perk with ID ${r.id}`,
    },
  };
}

export function makeUnmintInteractionResponse(
  r: UnmintResponse,
): APIInteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `Unminted ${r.type} perk with ID ${r.id}`,
    },
  };
}

export function makeAwardInteractionResponse(
  r: AwardResponse,
): APIInteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `Awarded perk ${r.mint_id} to ${r.awardee} (award ID: ${r.id})`,
    },
  };
}

export function makeRevokeInteractionResponse(
  r: RevokeResponse,
): APIInteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `Revoked perk ${r.mint_id} from ${r.awardee}`,
    },
  };
}

export function makeListInteractionResponse(
  r: ListResponse,
): APIInteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: r.awards.map((r) =>
        `${r.perk.type} perk ${r.award.id} (mint ID: ${r.perk.id}; uses remaining: ${r.perk.available}) awarded to ${r.award.awardee} by ${r.award.awarder} at ${r.award.awarded_at}`
      ).join("\n"),
    },
  };
}

export function makeErrorInteractionResponse(
  message: string,
): APIInteractionResponse {
  return {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `Error: ${message}`,
    },
  };
}
