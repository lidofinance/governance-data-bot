import { Injectable } from '@nestjs/common';
import { ConfigService, Network, NetworkConfig } from '../../common/config';
import { MotionType } from './easy-track.constants';

@Injectable()
export class EasyTrackConfig {
  private readonly config;

  constructor(protected readonly configService: ConfigService) {
    const networks: NetworkConfig = {
      [Network.mainnet]: {
        easyTrackContract: '0xF0211b7660680B49De1A7E9f25C65660F0a13Fea',
        nodeOperatorsRegistry: '0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5',
        governanceToken: '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
        stETH: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
        rewardProgramRegistry: '0x3129c041b372ee93a5a8756dc4ec6f154d85bc9a',
        referralPartnersRegistry: '0xfCaD241D9D2A2766979A2de208E8210eDf7b7D4F',
        easyTrackBaseUrl: 'https://easytrack.lido.fi/motions/',
        factoryToMotionType: {
          '0xfebd8fac16de88206d4b18764e826af38546afe0':
            MotionType.NodeOperatorIncreaseLimit,
          '0x648c8be548f43eca4e482c0801ebccccfb944931': MotionType.LEGOTopUp,
          '0x9d15032b91d01d5c1d940eb919461426ab0dd4e3':
            MotionType.RewardProgramAdd,
          '0xc21e5e72ffc223f02fc410aaede3084a63963932':
            MotionType.RewardProgramRemove,
          '0x77781a93c4824d2299a38ac8bbb11eb3cd6bc3b7':
            MotionType.RewardProgramTopUp,
          '0x929547490ceb6aeedd7d72f1ab8957c0210b6e51':
            MotionType.ReferralPartnerAdd,
          '0xe9eb838fb3a288bf59e9275ccd7e124fdff88a9c':
            MotionType.ReferralPartnerRemove,
          '0x54058ee0e0c87ad813c002262cd75b98a7f59218':
            MotionType.ReferralPartnerTopUp,
        },
      },
      [Network.goerli]: {
        easyTrackContract: '0xAf072C8D368E4DD4A9d4fF6A76693887d6ae92Af',
        nodeOperatorsRegistry: '0x9D4AF1Ee19Dad8857db3a45B0374c81c8A1C6320',
        governanceToken: '0x56340274fB5a72af1A3C6609061c451De7961Bd4',
        stETH: '0x1643e812ae58766192cf7d2cf9567df2c37e9b7f',
        rewardProgramRegistry: '0x28a08f61AE129d0d8BD4380Ae5647e7Add0527ca',
        referralPartnersRegistry: '0x4CB0c9987fd670069e4b24c653981E86b261A2ca',
        easyTrackBaseUrl: 'https://easytrack.testnet.fi/motions/',
        factoryToMotionType: {
          '0xe033673d83a8a60500bce02abd9007ffab587714':
            MotionType.NodeOperatorIncreaseLimit,
          '0xb2bcf211f103d7f13789394dd475c2274e044c4c': MotionType.LEGOTopUp,
          '0x5560d40b00ea3a64e9431f97b3c79b04e0cdf6f2':
            MotionType.RewardProgramAdd,
          '0x31b68d81125e52fe1adfe4076f8945d1014753b5':
            MotionType.RewardProgramRemove,
          '0x8180949ac41ef18e844ff8dafe604a195d86aea9':
            MotionType.RewardProgramTopUp,
          '0xe54ca3e867c52a34d262e94606c7a9371ab820c9':
            MotionType.ReferralPartnerAdd,
          '0x2a0c343087c6cfb721ffa20608a6ed0473c71275':
            MotionType.ReferralPartnerRemove,
          '0xb1e898fac74c377bef16712ba1cd4738606c19ee':
            MotionType.ReferralPartnerTopUp,
        },
      },
    };
    this.config = networks[this.configService.get('NETWORK')];
  }

  get(key: string): string {
    return this.config[key];
  }
}
