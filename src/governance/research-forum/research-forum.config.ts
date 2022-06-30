import { Injectable } from '@nestjs/common';
import { ConfigService, Network, NetworkConfig } from '../../common/config';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ResearchForumNetworkConfig = {};

@Injectable()
export class ResearchForumConfig {
  constructor(protected readonly configService: ConfigService) {}

  render(): ResearchForumNetworkConfig {
    const networks: NetworkConfig = {
      [Network.mainnet]: {},
      [Network.testnet]: undefined,
    };
    return networks[this.configService.network()];
  }
}
