import { ConfigService as ConfigServiceSource } from '@nestjs/config';
import { EnvironmentVariables, Network } from './env.validation';
import { CHAINS } from '@lido-nestjs/constants';

export type NetworkConfig = {
  [key in Network]: any;
};

export class ConfigService extends ConfigServiceSource<EnvironmentVariables> {
  /**
   * List of env variables that should be hidden
   */
  public get secrets(): string[] {
    return [
      ...this.get('EL_RPC_URLS'),
      this.get('SENTRY_DSN'),
      this.get('NOTION_INTEGRATION_TOKEN'),
      this.get('RESEARCH_FORUM_API_TOKEN'),
    ]
      .filter((v) => v)
      .map((v) => String(v));
  }

  public get<T extends keyof EnvironmentVariables>(key: T): EnvironmentVariables[T] {
    return super.get(key, { infer: true }) as EnvironmentVariables[T];
  }

  public isDryRun() {
    return this.get('DRY_RUN') === 'true';
  }

  public chainId() {
    switch (this.get('NETWORK')) {
      case 'mainnet':
        return CHAINS.Mainnet;
      case 'goerli':
        return CHAINS.Goerli;
    }
  }
}
