import { ConfigService as ConfigServiceSource } from '@nestjs/config';
import { EnvironmentVariables, Network } from './env.validation';

export type NetworkConfig = {
  [key in Network]: any;
};

export class ConfigService extends ConfigServiceSource<EnvironmentVariables> {
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
}
