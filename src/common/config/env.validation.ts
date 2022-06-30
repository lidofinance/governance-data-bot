import { plainToClass, Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  validateSync,
  Min,
  IsUrl,
  IsBooleanString,
  IsIn,
} from 'class-validator';
import { Environment, LogLevel, LogFormat } from './interfaces';

const toNumber =
  ({ defaultValue }) =>
  ({ value }) => {
    if (value === '' || value == null) return defaultValue;
    return Number(value);
  };

export enum Network {
  mainnet = 'mainnet',
  testnet = 'testnet',
}
export type TNetwork = keyof typeof Network;

export class EnvironmentVariables {
  @IsBooleanString()
  DRY_RUN: string;

  @IsString()
  @IsIn(Object.keys(Network).map((k) => Network[k]))
  NETWORK: TNetwork = Network.mainnet;

  @IsString()
  NOTION_INTEGRATION_TOKEN: string;

  @IsString()
  NOTION_VOTES_DATABASE_ID: string;

  @IsString()
  NOTION_TOPICS_DATABASE_ID: string;

  @IsUrl()
  ETH_RPC_URL: string;

  @IsUrl()
  EASYTRACK_MOTIONS_GRAPHQL_URL: string;

  @IsUrl()
  SNAPSHOT_PROPOSALS_GRAPHQL_URL: string;

  @IsUrl()
  SNAPSHOT_SCORES_API: string;

  @IsUrl()
  RESEARCH_FORUM_DISCOURSE_URL: string;

  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.development;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(toNumber({ defaultValue: 3000 }))
  PORT: number;

  @IsOptional()
  @IsString()
  CORS_WHITELIST_REGEXP = '';

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(toNumber({ defaultValue: 5 }))
  GLOBAL_THROTTLE_TTL: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(toNumber({ defaultValue: 100 }))
  GLOBAL_THROTTLE_LIMIT: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(toNumber({ defaultValue: 1 }))
  GLOBAL_CACHE_TTL: number;

  @IsOptional()
  @IsString()
  SENTRY_DSN: string | null = null;

  @IsOptional()
  @IsEnum(LogLevel)
  @Transform(({ value }) => value || LogLevel.info)
  LOG_LEVEL: LogLevel;

  @IsOptional()
  @IsEnum(LogFormat)
  @Transform(({ value }) => value || LogFormat.json)
  LOG_FORMAT: LogFormat;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config);

  const validatorOptions = { skipMissingProperties: false };
  const errors = validateSync(validatedConfig, validatorOptions);

  if (errors.length > 0) {
    console.error(errors.toString());
    process.exit(1);
  }

  return validatedConfig;
}
