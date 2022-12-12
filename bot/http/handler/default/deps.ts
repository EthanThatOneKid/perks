// TweetNaCl is a cryptography library that we use to verify requests
// from Discord.
export { default as nacl } from "https://cdn.skypack.dev/tweetnacl@v1.0.3?dts";

// The following are dependencies that are used in
// https://deno.com/deploy/docs/tutorial-discord-slash.
export { json, validateRequest } from "https://deno.land/x/sift@0.6.0/mod.ts";
