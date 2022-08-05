import { ConfigService, Network, NetworkConfig } from '../../common/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SnapshotConfig {
  private readonly config;
  constructor(protected readonly configService: ConfigService) {
    const networks: NetworkConfig = {
      [Network.mainnet]: {
        snapshotSpaceId: 'lido-snapshot.eth',
      },
      [Network.goerli]: undefined,
    };
    this.config = networks[this.configService.get('NETWORK')];
  }

  get(key: string): string {
    return this.config[key];
  }
}
