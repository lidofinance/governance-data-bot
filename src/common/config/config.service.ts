import { ConfigService as ConfigServiceSource } from '@nestjs/config';
import { EnvironmentVariables, Network } from './env.validation';
import { Logger } from '@nestjs/common';

export type NetworkConfig = {
  [key in Network]: any;
};

export interface NetworkConfigurable {
  config: any;
}

export class ConfigService extends ConfigServiceSource<EnvironmentVariables> {
  private readonly logger = new Logger(ConfigService.name);
  /**
   * List of env variables that should be hidden
   */
  public get secrets(): string[] {
    return [this.get('SENTRY_DSN') ?? '']
      .filter((v) => v)
      .map((v) => String(v));
  }

  public get<T extends keyof EnvironmentVariables>(
    key: T,
  ): EnvironmentVariables[T] {
    return super.get(key, { infer: true }) as EnvironmentVariables[T];
  }

  public isDryRun() {
    return this.get('DRY_RUN') === 'true';
  }

  public network() {
    return this.get('NETWORK');
  }

  public hasNetworkConfig(service: NetworkConfigurable) {
    try {
      if (!service.config) {
        this.logger.warn(
          `${
            service.constructor.name
          } don't have a network config for ${this.network()} network`,
        );
        return false;
      }
      return true;
    } catch (e) {
      this.logger.error(
        `Cannot read ${service.constructor.name} network config. Are you sure there is 'config' property?`,
      );
      return false;
    }
  }
}
