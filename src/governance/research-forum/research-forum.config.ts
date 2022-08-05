import { Injectable } from '@nestjs/common';
import { ConfigService, Network, NetworkConfig } from '../../common/config';

@Injectable()
export class ResearchForumConfig {
  private readonly config;
  constructor(protected readonly configService: ConfigService) {
    const networks: NetworkConfig = {
      [Network.mainnet]: {},
      [Network.goerli]: undefined,
    };
    this.config = networks[this.configService.get('NETWORK')];
  }

  get(key: string): string {
    return this.config[key];
  }
}
