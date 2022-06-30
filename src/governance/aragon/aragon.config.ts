import { Injectable } from '@nestjs/common';
import { ConfigService, Network, NetworkConfig } from '../../common/config';

export type AragonNetworkConfig = {
  votingContract: string;
  votingBaseUrl: string;
  additionalVotingBaseUrl: string;
};

@Injectable()
export class AragonConfig {
  constructor(protected readonly configService: ConfigService) {}

  render(): AragonNetworkConfig {
    const networks: NetworkConfig = {
      [Network.mainnet]: {
        votingContract: '0x2e59a20f205bb85a89c53f1936454680651e618e',
        votingBaseUrl:
          'https://mainnet.lido.fi/#/lido-dao/0x2e59a20f205bb85a89c53f1936454680651e618e/vote/',
        additionalVotingBaseUrl: 'https://vote.lido.fi/vote/',
      },
      [Network.testnet]: {
        votingContract: '0xbc0b67b4553f4cf52a913de9a6ed0057e2e758db',
        votingBaseUrl:
          'https://testnet.lido.fi/#/lido-testnet-prater/0xbc0b67b4553f4cf52a913de9a6ed0057e2e758db/vote/',
        additionalVotingBaseUrl: 'https://vote.testnet.fi/vote',
      },
    };
    return networks[this.configService.network()];
  }
}
