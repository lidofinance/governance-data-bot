import { Injectable } from '@nestjs/common';
import { ConfigService, Network, NetworkConfig } from '../../common/config';
import { MotionType } from './easy-track.constants';
import { CaseInsensitiveMap } from '../governance.utils';

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
        allowedRecipientsReWARDSRegistryAddress: '0xAa47c268e6b2D4ac7d7f7Ffb28A39484f5212c2A',
        allowedRecipientsLegoLDORegistryAddress: '0x97615f72c3428A393d65A84A3ea6BBD9ad6C0D74',
        allowedRecipientsLegoDAIRegistryAddress: '0xb0FE4D300334461523D9d61AaD90D0494e1Abb43',
        allowedRecipientsRccDAIRegistryAddress: '0xDc1A0C7849150f466F07d48b38eAA6cE99079f80',
        allowedRecipientsPmlDAIRegistryAddress: '0xDFfCD3BF14796a62a804c1B16F877Cf7120379dB',
        allowedRecipientsAtcDAIRegistryAddress: '0xe07305F43B11F230EaA951002F6a55a16419B707',
        allowedRecipientsGasETHRegistryAddress: '0xCf46c4c7f936dF6aE12091ADB9897E3F2363f16F',
        allowedRecipientsReferralProgramDAIRegistryAddress:
          '0xa295C212B44a48D07746d70d32Aa6Ca9b09Fb846',
        allowedRecipientsTRPRegistryAddress: '0x231Ac69A1A37649C6B06a71Ab32DdD92158C80b8',
        allowedRecipientsGasStETHRegistryAddress: '0x49d1363016aA899bba09ae972a1BF200dDf8C55F',
        easyTrackBaseUrl: 'https://easytrack.lido.fi/motions/',
        etherscanBaseUrl: 'https://etherscan.io/',
        easyTrackStartBlock: 13676729,
        factoryToMotionType: new CaseInsensitiveMap<MotionType>(
          Object.entries({
            '0xfebd8fac16de88206d4b18764e826af38546afe0': MotionType.NodeOperatorIncreaseLimit,
            '0x648c8be548f43eca4e482c0801ebccccfb944931': MotionType.LEGOTopUp,
            '0x9d15032b91d01d5c1d940eb919461426ab0dd4e3': MotionType.RewardProgramAdd,
            '0xc21e5e72ffc223f02fc410aaede3084a63963932': MotionType.RewardProgramRemove,
            '0x77781a93c4824d2299a38ac8bbb11eb3cd6bc3b7': MotionType.RewardProgramTopUp,
            '0x929547490ceb6aeedd7d72f1ab8957c0210b6e51': MotionType.ReferralPartnerAdd,
            '0xe9eb838fb3a288bf59e9275ccd7e124fdff88a9c': MotionType.ReferralPartnerRemove,
            '0x54058ee0e0c87ad813c002262cd75b98a7f59218': MotionType.ReferralPartnerTopUp,
            '0x1dcfc37719a99d73a0ce25ceecbefbf39938cf2c': MotionType.AddAllowedRecipientReWARDS,
            '0x00bb68a12180a8f7e20d8422ba9f81c07a19a79e': MotionType.RemoveAllowedRecipientReWARDS,
            '0x85d703b2a4bad713b596c647badac9a1e95bb03d': MotionType.TopUpAllowedRecipientsReWARDS,
            '0x00caaef11ec545b192f16313f53912e453c91458': MotionType.TopUpAllowedRecipientsLegoLDO,
            '0x0535a67ea2d6d46f85fe568b7eaa91ca16824fec': MotionType.TopUpAllowedRecipientsLegoDAI,
            '0x84f74733ede9bfd53c1b3ea96338867c94ec313e': MotionType.TopUpAllowedRecipientsRccDAI,
            '0x4e6d3a5023a38ce2c4c5456d3760357fd93a22cd': MotionType.TopUpAllowedRecipientsPmlDAI,
            '0x67fb97abb9035e2e93a7e3761a0d0571c5d7cd07': MotionType.TopUpAllowedRecipientsAtcDAI,
            '0x41f9dac5f89092dd6061e59578a2611849317dc8': MotionType.TopUpAllowedRecipientsGasETH,
            '0x8f06a7f244f6bb4b68cd6db05213042bfc0d7151':
              MotionType.AddAllowedRecipientReferralProgramDAI,
            '0xd8f9b72cd97388f23814ecf429cd18815f6352c1':
              MotionType.RemoveAllowedRecipientReferralProgramDAI,
            '0x009ffa22ce4388d2f5de128ca8e6fd229a312450':
              MotionType.TopUpAllowedRecipientsReferralProgramDAI,
            '0xbd2b6dc189eefd51b273f5cb2d99ba1ce565fb8c': MotionType.TopUpAllowedRecipientsTRP,
            '0x935cb3366faf2cfc415b2099d1f974fd27202b77': MotionType.AddAllowedRecipientStETH,
            '0x22010d1747cafc370b1f1fbba61022a313c5693b': MotionType.RemoveAllowedRecipientStETH,
            '0x1f2b79fe297b7098875930bba6dd17068103897e': MotionType.TopUpAllowedRecipientsStETH,
            '0x200dA0b6a9905A377CF8D469664C65dB267009d1': MotionType.TopUpAllowedRecipientsGasStETH,
            '0x48c135Ff690C2Aa7F5B11C539104B5855A4f9252': MotionType.AddAllowedRecipientGasStETH,
            '0x7E8eFfAb3083fB26aCE6832bFcA4C377905F97d7': MotionType.RemoveAllowedRecipientGasStETH,
            '0xcD42Eb8a5db5a80Dc8f643745528DD77cf4C7D35': MotionType.TopUpAllowedRecipientsRccStETH,
            '0xc5527396DDC353BD05bBA578aDAa1f5b6c721136': MotionType.TopUpAllowedRecipientsPmlStETH,
            '0x87b02dF27cd6ec128532Add7C8BC19f62E6f1fB9': MotionType.TopUpAllowedRecipientsAtcStETH,
          }),
        ),
        motionTypeToRecipientsRegistryAddress: {
          [MotionType.TopUpAllowedRecipientsRccStETH]: '0xAAC4FcE2c5d55D1152512fe5FAA94DB267EE4863',
          [MotionType.TopUpAllowedRecipientsPmlStETH]: '0x7b9B8d00f807663d46Fb07F87d61B79884BC335B',
          [MotionType.TopUpAllowedRecipientsAtcStETH]: '0xd3950eB3d7A9B0aBf8515922c0d35D13e85a2c91',
          [MotionType.TopUpAllowedRecipientsStETH]: '0x48c4929630099b217136b64089E8543dB0E5163a',
        },
      },
      [Network.goerli]: {
        easyTrackContract: '0xAf072C8D368E4DD4A9d4fF6A76693887d6ae92Af',
        nodeOperatorsRegistry: '0x9D4AF1Ee19Dad8857db3a45B0374c81c8A1C6320',
        governanceToken: '0x56340274fB5a72af1A3C6609061c451De7961Bd4',
        stETH: '0x1643e812ae58766192cf7d2cf9567df2c37e9b7f',
        rewardProgramRegistry: '0x28a08f61AE129d0d8BD4380Ae5647e7Add0527ca',
        referralPartnersRegistry: '0x4CB0c9987fd670069e4b24c653981E86b261A2ca',
        allowedRecipientsReWARDSRegistryAddress: '0xaDA19288575f611A6487365f0fE2A742a90BB2C6',
        allowedRecipientsLegoLDORegistryAddress: '0x6342213719839c56fEe817539863aFB9821B03cb',
        allowedRecipientsLegoDAIRegistryAddress: '0x5884f5849414D4317d175fEc144e2F87f699B082',
        allowedRecipientsRccDAIRegistryAddress: '0x1440E8aDbE3a42a9EDB4b30059df8F6c35205a15',
        allowedRecipientsPmlDAIRegistryAddress: '0xAadfBd1ADE92d85c967f4aE096141F0F802F46Db',
        allowedRecipientsAtcDAIRegistryAddress: '0xedD3B813275e1A88c2283FAfa5bf5396938ef59e',
        allowedRecipientsGasETHRegistryAddress: '0x0000000000000000000000000000000000000000',
        allowedRecipientsReferralProgramDAIRegistryAddress:
          '0x8fB566b1e78e603a86b97ada5FcA858764dF4088',
        allowedRecipientsTRPRegistryAddress: '0x8C96a6522aEc036C4a384f8B7e05D93d6f3Dae39',
        allowedRecipientsGasStETHRegistryAddress: '0xF08a5f00824D4554a1FBebaE726609418dc819fb',
        easyTrackBaseUrl: 'https://easytrack.testnet.fi/motions/',
        etherscanBaseUrl: 'https://goerli.etherscan.io/',
        easyTrackStartBlock: 5574275,
        factoryToMotionType: new CaseInsensitiveMap<MotionType>(
          Object.entries({
            '0xe033673d83a8a60500bce02abd9007ffab587714': MotionType.NodeOperatorIncreaseLimit,
            '0xb2bcf211f103d7f13789394dd475c2274e044c4c': MotionType.LEGOTopUp,
            '0x5560d40b00ea3a64e9431f97b3c79b04e0cdf6f2': MotionType.RewardProgramAdd,
            '0x31b68d81125e52fe1adfe4076f8945d1014753b5': MotionType.RewardProgramRemove,
            '0x8180949ac41ef18e844ff8dafe604a195d86aea9': MotionType.RewardProgramTopUp,
            '0xe54ca3e867c52a34d262e94606c7a9371ab820c9': MotionType.ReferralPartnerAdd,
            '0x2a0c343087c6cfb721ffa20608a6ed0473c71275': MotionType.ReferralPartnerRemove,
            '0xb1e898fac74c377bef16712ba1cd4738606c19ee': MotionType.ReferralPartnerTopUp,
            '0x3ef70849fdbee7b1f0a43179a3f788a8949b8abe': MotionType.AddAllowedRecipientReWARDS,
            '0x6c2e12d9c1d6e3de146a7519ecbcb79c96fe3146': MotionType.RemoveAllowedRecipientReWARDS,
            '0xd928dc9e4dabee939d3237a4f41983ff5b6308db': MotionType.TopUpAllowedRecipientsReWARDS,
            '0xc39dd5b66968e364d99e0c9e7089049351ab89ca': MotionType.TopUpAllowedRecipientsLegoLDO,
            '0xbf44ec2b23ca105f8a62e0587900a09a473288c6': MotionType.TopUpAllowedRecipientsLegoDAI,
            '0xd0411e7c4a24e7d4509d5f13aed19aeb8e5644ab': MotionType.TopUpAllowedRecipientsRccDAI,
            '0xc749ad24572263887bc888d3cb854fcd50eccb61': MotionType.TopUpAllowedRecipientsPmlDAI,
            '0xf4b8b5760ee4b5c5cb154edd0f0841465d821006': MotionType.TopUpAllowedRecipientsAtcDAI,
            '0x734458219be229f6631f083ea574ebaca2f9beaf':
              MotionType.AddAllowedRecipientReferralProgramDAI,
            '0x5fec0bcd7519c4fe41eca5fe1dd94345fa100a67':
              MotionType.RemoveAllowedRecipientReferralProgramDAI,
            '0x9534a77029d57e249c467e5a1e0854cc26cd75a0':
              MotionType.TopUpAllowedRecipientsReferralProgramDAI,
            '0x43f33c52156d1fb2ea24d82abfd342e69835e79f': MotionType.TopUpAllowedRecipientsTRP,
            '0x785a8b1cdc03bb191670ed4696e9ed5b11af910a': MotionType.AddAllowedRecipientStETH,
            '0xefea524d1739800ff6f7d2532ed4c8508220239a': MotionType.RemoveAllowedRecipientStETH,
            '0xf2f7fc1e8879c10d4579bc82d5fea923a5a228de': MotionType.TopUpAllowedRecipientsStETH,
            '0x960CcA0BE6419e9684796Ce3ABE980E8a2d0cd80': MotionType.TopUpAllowedRecipientsGasStETH,
            '0xa2286d37Af8F8e84428151bF72922c5Fe5c1EeED': MotionType.AddAllowedRecipientGasStETH,
            '0x48D01979eD9e6CE70a6496B111F5728f9a547C96': MotionType.RemoveAllowedRecipientGasStETH,
          }),
        ),
        motionTypeToRecipientsRegistryAddress: {
          [MotionType.TopUpAllowedRecipientsStETH]: '0x78797efCca6C537BF92FA6b25cBb14A6f1c128A0',
        },
      },
    };
    this.config = networks[this.configService.get('NETWORK')];
  }

  get<T = string>(key: string): T {
    return this.config[key];
  }
}
