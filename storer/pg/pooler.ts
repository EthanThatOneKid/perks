import type { QueryArguments, QueryObjectResult } from "./deps.ts";

/**
 * Pooler is a wrapper around the postgres client that provides only the required client methods.
 *
 * @todo Implement fake pooler for testing.
 */
export interface Pooler {
  connect(): Promise<Client>;
}

interface Client {
  queryObject<T>(
    query: string,
    args?: QueryArguments,
  ): Promise<QueryObjectResult<T>>;
  release(): void;
}
