import type { APIApplicationCommandOption } from "../../../deps.ts";
import { ApplicationCommandOptionType } from "../../../deps.ts";

export const REVOKE = "revoke";
export const REVOKE_DESCRIPTION = "Revoke a perk";
export const REVOKE_AWARD_ID = "award_id";
export const REVOKE_AWARD_ID_DESCRIPTION = "The ID of the award";

/** example revoke: /perks revoke <award_id> */
export const SUB_REVOKE: APIApplicationCommandOption = {
  name: REVOKE,
  description: REVOKE_DESCRIPTION,
  type: ApplicationCommandOptionType.Subcommand,
  options: [
    {
      name: REVOKE_AWARD_ID,
      description: REVOKE_AWARD_ID_DESCRIPTION,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};
