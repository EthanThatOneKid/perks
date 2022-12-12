import type { APIApplicationCommandOption } from "../../../deps.ts";
import { ApplicationCommandOptionType } from "../../../deps.ts";

export const UNMINT = "unmint";
export const UNMINT_DESCRIPTION = "Unmint a perk";
export const UNMINT_MINT_ID = "mint_id";
export const REVOKE_MINT_ID_DESCRIPTION = "The ID of the minted perk";

/** example revoke: /perks unmint <mint_id> */
export const SUB_UNMINT: APIApplicationCommandOption = {
  name: UNMINT,
  description: UNMINT_DESCRIPTION,
  type: ApplicationCommandOptionType.Subcommand,
  options: [
    {
      name: UNMINT_MINT_ID,
      description: REVOKE_MINT_ID_DESCRIPTION,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};
