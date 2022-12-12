import type { Storer } from "../../storer/mod.ts";
import { MintedPerk } from "../mod.ts";
import { Registry } from "../provider/registry/mod.ts";

import type {
  AwardRequest,
  AwardResponse,
  EngineInterface,
  ListRequest,
  ListResponse,
  MintRequest,
  MintResponse,
  RevokeRequest,
  RevokeResponse,
  UnmintRequest,
  UnmintResponse,
  UseRequest,
  UseResponse,
} from "./types.ts";

export class Engine implements EngineInterface {
  constructor(
    public readonly storer: Storer,
    public readonly registry: Registry,
  ) {}

  public async mint(r: MintRequest): Promise<MintResponse> {
    const minted = await this.storer.doMintQuery({
      type: r.type,
      minter: r.minter,
      max_uses: r.max_uses ?? 10,
      milliseconds: r.milliseconds ?? 3.6e6,
    });
    return {
      id: minted.id,
      type: minted.type,
      minter: minted.minter,
      minted_at: minted.minted_at,
      max_uses: minted.max_uses,
      milliseconds: minted.milliseconds,
      available: minted.available,
    };
  }

  public async unmint(r: UnmintRequest): Promise<UnmintResponse> {
    const unminted = await this.storer.doUnmintQuery({ id: r.id });
    return {
      id: unminted.id,
      type: unminted.type,
      minter: unminted.minter,
      minted_at: unminted.minted_at,
      max_uses: unminted.max_uses,
      milliseconds: unminted.milliseconds,
      available: unminted.available,
      activated: unminted.activated,
    };
  }

  public async award(r: AwardRequest): Promise<AwardResponse> {
    const awarded = await this.storer.doAwardQuery({
      awarder: r.awarder,
      awardee: r.awardee,
      mint_id: r.mint_id,
    });
    return {
      id: awarded.id,
      awarder: awarded.awarder,
      awardee: awarded.awardee,
      mint_id: awarded.mint_id,
      awarded_at: awarded.awarded_at,
    };
  }

  public async list(r: ListRequest): Promise<ListResponse> {
    const awards = await this.storer.doListQuery({ awardee: r.awardee });
    return {
      awards: awards.map((a) => ({
        perk: {
          id: a.perk.id,
          type: a.perk.type,
          minter: a.perk.minter,
          minted_at: a.perk.minted_at,
          max_uses: a.perk.max_uses,
          milliseconds: a.perk.milliseconds,
          available: a.perk.available,
          activated: a.perk.activated,
        },
        award: {
          id: a.award.id,
          awarder: a.award.awarder,
          awardee: a.award.awardee,
          mint_id: a.award.mint_id,
          awarded_at: a.award.awarded_at,
        },
      })),
    };
  }

  public async revoke(r: RevokeRequest): Promise<RevokeResponse> {
    const revoked = await this.storer.doRevokeQuery({ id: r.award_id });
    return {
      id: revoked.id,
      awarder: revoked.awarder,
      awardee: revoked.awardee,
      mint_id: revoked.mint_id,
      awarded_at: revoked.awarded_at,
    };
  }

  public async use(r: UseRequest): Promise<UseResponse> {
    const preused = await this.storer.doPreuseQuery({ mint_id: r.mint_id });
    if (checkConsumed(preused.perk)) {
      throw new Error("Perk has already been consumed");
    }

    const provider = this.registry.get(preused.perk.type);
    if (!provider) {
      throw new Error("Perk provider not found");
    }

    const response = await provider.use({ ...preused });
    if (!response) {
      throw new Error("Perk not used");
    }

    await this.storer.doUseQuery({ mint_id: r.mint_id });
    return { data: response };
  }
}

function checkConsumed(perk: MintedPerk) {
  return perk.available <= 0 ||
    (perk.milliseconds > 0 && perk.activated && (
      Date.now() - new Date(perk.activated).getTime() >
        perk.milliseconds
    ));
}
