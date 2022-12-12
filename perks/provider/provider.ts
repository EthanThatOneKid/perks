import type { APIInteractionResponse } from "../../bot/deps.ts";
import type { StoredSummary } from "../../storer/storer.ts";

export interface ProviderRequest extends StoredSummary {
  query?: string;
}

/**
 * Provider for a Perk.
 */
export interface Provider {
  name: string;

  use(r: ProviderRequest): Promise<APIInteractionResponse>;
}

// /**
//  * Provider for a Perk.
//  */
// export abstract class Provider {
//   name: string;

//   constructor(name: string) {
//     this.name = name;
//   }

//   abstract use(r: ProviderRequest): Promise<APIInteractionResponse>;
// }
