import {
  SQL_QUERY_AWARD,
  SQL_QUERY_LIST,
  SQL_QUERY_MINT,
  SQL_QUERY_PREUSE,
  SQL_QUERY_REVOKE,
  SQL_QUERY_UNMINT,
  SQL_QUERY_USE,
  SQL_TABLE_AWARDS,
  SQL_TABLE_PERKS,
} from "../mod.ts";

import type {
  AwardQuery,
  ListQuery,
  MintQuery,
  PreuseQuery,
  RevokeQuery,
  StoredAward,
  StoredPerk,
  StoredSummary,
  Storer,
  UnmintQuery,
  UseQuery,
} from "../mod.ts";

import type { Pooler } from "./pooler.ts";

export class PgStorer implements Storer {
  constructor(private readonly pool: Pooler) {}

  public async doMintQuery(q: MintQuery): Promise<StoredPerk> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<StoredPerk>(
        SQL_QUERY_MINT(q),
        [
          q.type,
          q.minter,
          q.max_uses,
          q.milliseconds,
          q.max_uses,
        ],
      );
      const row = result.rows[0];
      console.log("TODO: DELETE ME", { row });
      return row;
    } finally {
      client.release();
    }
  }

  public async doUnmintQuery(q: UnmintQuery): Promise<StoredPerk> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<StoredPerk>(SQL_QUERY_UNMINT(q), [
        q.id,
      ]);
      const row = result.rows[0];
      console.log("TODO: DELETE ME", { row });
      return row;
    } finally {
      client.release();
    }
  }

  public async doAwardQuery(q: AwardQuery): Promise<StoredAward> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<StoredAward>(
        SQL_QUERY_AWARD(q),
        [q.mint_id, q.awardee, q.awarder],
      );
      const row = result.rows[0];
      console.log("TODO: DELETE ME", { row });
      return row;
    } finally {
      client.release();
    }
  }

  public async doRevokeQuery(q: RevokeQuery): Promise<StoredAward> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<StoredAward>(
        SQL_QUERY_REVOKE(q),
        [q.id],
      );
      const row = result.rows[0];
      console.log("TODO: DELETE ME", { row });
      return row;
    } finally {
      client.release();
    }
  }

  public async doListQuery(q: ListQuery): Promise<StoredSummary[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<StoredSummary>(
        SQL_QUERY_LIST(q),
        [
          q.awardee,
        ],
      );
      const rows = result.rows;
      console.log("TODO: DELETE ME", { rows });
      return rows;
    } finally {
      client.release();
    }
  }

  public async doPreuseQuery(q: PreuseQuery): Promise<StoredSummary> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<StoredSummary>(
        SQL_QUERY_PREUSE(q),
        [q.mint_id],
      );
      const row = result.rows[0];
      console.log("TODO: DELETE ME", { row });
      return row;
    } finally {
      client.release();
    }
  }

  public async doUseQuery(q: UseQuery): Promise<StoredPerk> {
    const client = await this.pool.connect();
    try {
      const result = await client.queryObject<StoredPerk>(
        SQL_QUERY_USE(q),
        [q.mint_id],
      );
      const row = result.rows[0];
      console.log("TODO: DELETE ME", { row });
      return row;
    } finally {
      client.release();
    }
  }

  public async createTables(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.queryObject(SQL_TABLE_PERKS);
      await client.queryObject(SQL_TABLE_AWARDS);
    } finally {
      client.release();
    }
  }
}
