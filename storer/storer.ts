import type { Award, MintedPerk } from "../perks/mod.ts";

export const SQL_TABLE_PERKS = `CREATE TABLE IF NOT EXISTS perks (
  type VARCHAR(255) NOT NULL,
  minter VARCHAR(255) NOT NULL,
  minted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  max_uses INTEGER NOT NULL,
  milliseconds INTEGER NOT NULL,
  available INTEGER NOT NULL,
  activated TIMESTAMP,

  id SERIAL PRIMARY KEY
);`;

export const SQL_TABLE_AWARDS = `CREATE TABLE IF NOT EXISTS awards (
  awarder VARCHAR(255) NOT NULL,
  awardee VARCHAR(255) NOT NULL,
  awarded_at TIMESTAMP NOT NULL DEFAULT NOW(),
  mint_id INTEGER NOT NULL,

  FOREIGN KEY (mint_id) REFERENCES perks(id) ON DELETE CASCADE,
  id SERIAL PRIMARY KEY
);`;

export interface MintQuery {
  type: string;
  minter: string;
  max_uses: number;
  milliseconds: number;
}

export type StoredPerk = MintedPerk;

export const SQL_QUERY_MINT = (q: MintQuery) =>
  `INSERT INTO perks (
  type,
  minter,
  max_uses,
  milliseconds,
  available,
  minted_at,
  activated
) VALUES (
  ${JSON.stringify(q.type)},
  ${JSON.stringify(q.minter)},
  ${q.max_uses},
  ${q.milliseconds},
  NOW(),
  NULL
) RETURNING *;`;

export type UnmintQuery = Pick<MintedPerk, "id">;

export const SQL_QUERY_UNMINT = (q: UnmintQuery) =>
  `DELETE FROM perks
WHERE id = ${q.id}
  RETURNING *;`;

export interface AwardQuery {
  awarder: string;
  awardee: string;
  mint_id: string;
}

export type StoredAward = Award;

export const SQL_QUERY_AWARD = (q: AwardQuery) =>
  `INSERT INTO awards (
  awarder,
  awardee,
  mint_id,
  awarded_at
) VALUES (
  ${JSON.stringify(q.awarder)},
  ${JSON.stringify(q.awardee)},
  ${JSON.stringify(q.mint_id)},
  NOW()
) RETURNING *;`;

export type RevokeQuery = Pick<Award, "id">;

export const SQL_QUERY_REVOKE = (q: RevokeQuery) =>
  `DELETE FROM awards
WHERE id = ${q.id}
  RETURNING *;`;

export interface ListQuery {
  awardee?: string;
}

export interface StoredSummary {
  perk: StoredPerk;
  award: StoredAward;
}

export const SQL_QUERY_LIST = (q: ListQuery) =>
  `SELECT
  perks.id AS perk_id,
  perks.type AS perk_type,
  perks.minter AS perk_minter,
  perks.max_uses AS perk_max_uses,
  perks.milliseconds AS perk_milliseconds,
  perks.available AS perk_available,
  perks.activated AS perk_activated,
  awards.id AS award_id,
  awards.awarder AS award_awarder,
  awards.awardee AS award_awardee,
  awards.mint_id AS award_mint_id
FROM awards
INNER JOIN perks ON perks.id = awards.mint_id
WHERE
  ${q.awardee ? `awardee = ${JSON.stringify(q.awardee)}` : "TRUE"}
  awards.awardee = ${JSON.stringify(q.awardee)};`;

export interface PreuseQuery {
  mint_id: string;
}

export const SQL_QUERY_PREUSE = (q: PreuseQuery) =>
  `SELECT
  perks.id AS perk_id,
  perks.type AS perk_type,
  perks.minter AS perk_minter,
  perks.max_uses AS perk_max_uses,
  perks.milliseconds AS perk_milliseconds,
  perks.available AS perk_available,
  perks.activated AS perk_activated,
  awards.id AS award_id,
  awards.awarder AS award_awarder,
  awards.awardee AS award_awardee,
  awards.mint_id AS award_mint_id
FROM awards
INNER JOIN perks ON perks.id = awards.mint_id
WHERE
  perks.id = ${JSON.stringify(q.mint_id)};`;

export type UseQuery = PreuseQuery;

export const SQL_QUERY_USE = (q: UseQuery) =>
  `UPDATE perks SET
  activated = NOW() IF available == max_uses
  available = available - 1
WHERE
  id = ${JSON.stringify(q.mint_id)}
RETURNING *;`;

/**
 * Storer stores what authorized users use to mint and award perks.
 */
export interface Storer {
  doMintQuery: (q: MintQuery) => Promise<StoredPerk>;
  doUnmintQuery: (q: UnmintQuery) => Promise<StoredPerk>;
  doAwardQuery: (q: AwardQuery) => Promise<StoredAward>;
  doRevokeQuery: (q: RevokeQuery) => Promise<StoredAward>;
  doListQuery: (q: ListQuery) => Promise<StoredSummary[]>;
  doPreuseQuery: (q: PreuseQuery) => Promise<StoredSummary>;
  doUseQuery: (q: UseQuery) => Promise<StoredPerk>;

  createTables: () => Promise<void>;
}
