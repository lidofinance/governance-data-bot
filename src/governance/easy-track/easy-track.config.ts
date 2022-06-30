import { Injectable } from '@nestjs/common';
import { ConfigService, Network, NetworkConfig } from '../../common/config';

export type EasyTrackNetworkConfig = {
  easyTrackContract: string;
  nodeOperatorsRegistry: string;
  governanceToken: string;
  stETH: string;
  rewardProgramRegistry: string;
  referralPartnersRegistry: string;
  easyTrackBaseUrl: string;
};

@Injectable()
export class EasyTrackConfig {
  constructor(protected readonly configService: ConfigService) {}

  render(): EasyTrackNetworkConfig {
    const networks: NetworkConfig = {
      [Network.mainnet]: {
        easyTrackContract: '0xF0211b7660680B49De1A7E9f25C65660F0a13Fea',
        nodeOperatorsRegistry: '0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5',
        governanceToken: '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
        stETH: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
        rewardProgramRegistry: '0x3129c041b372ee93a5a8756dc4ec6f154d85bc9a',
        referralPartnersRegistry: '0xfCaD241D9D2A2766979A2de208E8210eDf7b7D4F',
        easyTrackBaseUrl: 'https://easytrack.lido.fi/motions/',
      },
      [Network.testnet]: {
        easyTrackContract: '0xAf072C8D368E4DD4A9d4fF6A76693887d6ae92Af',
        nodeOperatorsRegistry: '0x9D4AF1Ee19Dad8857db3a45B0374c81c8A1C6320',
        governanceToken: '0x56340274fB5a72af1A3C6609061c451De7961Bd4',
        stETH: '0x1643e812ae58766192cf7d2cf9567df2c37e9b7f',
        rewardProgramRegistry: '0x28a08f61AE129d0d8BD4380Ae5647e7Add0527ca',
        referralPartnersRegistry: '0x4CB0c9987fd670069e4b24c653981E86b261A2ca',
        easyTrackBaseUrl: 'https://easytrack.testnet.fi/motions/',
      },
    };
    return networks[this.configService.network()];
  }
}
