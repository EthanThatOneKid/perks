import type { APIInteractionResponse } from "../../bot/deps.ts";
import type { Award, MintedPerk } from "../mod.ts";

/**
 * EngineInterface is what authorized users use to mint and award perks.
 */
export interface EngineInterface {
  /** example mint: /perks mint <perk_name> <max_uses?> <milliseconds?> */
  mint: (r: MintRequest) => Promise<MintResponse>;

  /** example unmint: /perks unmint <mint_id> */
  unmint: (r: UnmintRequest) => Promise<UnmintResponse>;

  /** example award: /perks award <mint_id> <member_id> */
  award: (r: AwardRequest) => Promise<AwardResponse>;

  /** example list: /perks list <member_id?> */
  list: (r: ListRequest) => Promise<ListResponse>;

  /** example revoke: /perks revoke <award_id> */
  revoke: (r: RevokeRequest) => Promise<RevokeResponse>;

  /** example use: /perks use <perk_name> <query?> */
  use: (r: UseRequest) => Promise<UseResponse>;
}

export interface MintRequest {
  type: string; // The name of the perk to be minted.
  minter: string; // The ID of the authorized user who minted the perk.
  max_uses?: number; // The number of times this perk can be consumed.
  milliseconds?: number; // The number of milliseconds this perk is valid for.
}

export type MintResponse = MintedPerk;

export type UnmintRequest = Pick<MintedPerk, "id">;
export type UnmintResponse = MintedPerk;

export type AwardRequest = Omit<Award, "id" | "awarded_at">;
export type AwardResponse = Award;

export interface AwardSummary {
  perk: MintedPerk;
  award: Award;
}

export interface ListRequest {
  awardee?: string;
}

export interface ListResponse {
  awards: AwardSummary[];
}

export interface RevokeRequest {
  award_id: string;
}

export type RevokeResponse = Award;

export interface UseRequest {
  mint_id: string;
  query?: string;
}

export interface UseResponse {
  // perk: MintedPerk;
  // award: Award;
  data: APIInteractionResponse;
}
