import type { Provider } from "../mod.ts";

export class Registry {
  private readonly providers: Map<string, Provider> = new Map();

  constructor(providers: Provider[]) {
    this.register(providers);
  }

  public register(providers: Provider[]): void {
    for (const provider of providers) {
      this.providers.set(provider.name, provider);
    }
  }

  public get(name: string): Provider | undefined {
    return this.providers.get(name);
  }
}
