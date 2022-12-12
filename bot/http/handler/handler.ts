/**
 * Handler for HTTP requests.
 */
export interface Handler {
  handle: (req: Request) => Promise<Response>;
}
