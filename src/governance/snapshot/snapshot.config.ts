import { ConfigService, Network, NetworkConfig } from '../../common/config';
import { Injectable } from '@nestjs/common';

export type SnapshotNetworkConfig = {
  snapshotSpaceId: string;
};

@Injectable()
export class SnapshotConfig {
  constructor(protected readonly configService: ConfigService) {}

  render(): SnapshotNetworkConfig {
    const networks: NetworkConfig = {
      [Network.mainnet]: {
        snapshotSpaceId: 'lido-snapshot.eth',
      },
      [Network.testnet]: undefined,
    };
    return networks[this.configService.network()];
  }
}
