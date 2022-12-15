import { Injectable } from '@nestjs/common';
import { ConfigService, Network, NetworkConfig } from '../../common/config';

@Injectable()
export class AragonConfig {
  private readonly config;

  constructor(protected readonly configService: ConfigService) {
    const networks: NetworkConfig = {
      [Network.mainnet]: {
        votingContract: '0x2e59a20f205bb85a89c53f1936454680651e618e',
        votingBaseUrl:
          'https://mainnet.lido.fi/#/lido-dao/0x2e59a20f205bb85a89c53f1936454680651e618e/vote/',
        additionalVotingBaseUrl: 'https://vote.lido.fi/vote/',
      },
      [Network.goerli]: {
        votingContract: '0xbc0b67b4553f4cf52a913de9a6ed0057e2e758db',
        votingBaseUrl:
          'https://testnet.lido.fi/#/lido-testnet-prater/0xbc0b67b4553f4cf52a913de9a6ed0057e2e758db/vote/',
        additionalVotingBaseUrl: 'https://vote.testnet.fi/vote/',
      },
    };
    this.config = networks[this.configService.get('NETWORK')];
  }

  get(key: string): string {
    return this.config[key];
  }
}
