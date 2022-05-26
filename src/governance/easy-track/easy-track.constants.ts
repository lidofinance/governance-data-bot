import * as EasyTrack from './abi/EasyTrack.abi.json';
import * as EvmAddReferralPartner from './abi/EvmAddReferralPartner.abi.json';
import * as EvmAddRewardProgram from './abi/EvmAddRewardProgram.abi.json';
import * as EvmIncreaseNodeOperatorStakingLimit from './abi/EvmIncreaseNodeOperatorStakingLimit.abi.json';
import * as EvmRemoveReferralPartner from './abi/EvmRemoveReferralPartner.abi.json';
import * as EvmRemoveRewardProgram from './abi/EvmRemoveRewardProgram.abi.json';
import * as EvmTopUpLegoProgram from './abi/EvmTopUpLegoProgram.abi.json';
import * as EvmTopUpReferralPartners from './abi/EvmTopUpReferralPartners.abi.json';
import * as EvmTopUpRewardPrograms from './abi/EvmTopUpRewardPrograms.abi.json';
import * as NodeOperatorsRegistry from './abi/NodeOperators.abi.json';
import * as ERC20 from './abi/ERC20.min.abi.json';
import * as RewardProgramRegistry from './abi/RewardProgramRegistry.abi.json';
import * as ReferralPartnersRegistry from './abi/ReferralPartnersRegistry.abi.json';
import { BigNumber } from 'ethers';

export const EASYTRACK_CONTRACT_ABI = EasyTrack;
export const EASYTRACK_CONTRACT_ADDRESS =
  '0xF0211b7660680B49De1A7E9f25C65660F0a13Fea';
export const NODE_OPERATORS_REGISTRY_ADDRESS =
  '0x55032650b14df07b85bF18A3a3eC8E0Af2e028d5';
export const GOVERNANCE_TOKEN_ADDRESS =
  '0x5a98fcbea516cf06857215779fd812ca3bef1b32';
export const stETH_ADDRESS = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84';
export const REWARD_PROGRAM_REGISTRY_ADDRESS =
  '0x3129c041b372ee93a5a8756dc4ec6f154d85bc9a';
export const REFERRAL_PARTNERS_REGISTRY_ADDRESS =
  '0xfCaD241D9D2A2766979A2de208E8210eDf7b7D4F';
export const EASYTRACK_LINK_TEMPLATE = 'https://easytrack.lido.fi/motions/';

export const abi = {
  EasyTrack,
  EvmAddReferralPartner,
  EvmAddRewardProgram,
  EvmIncreaseNodeOperatorStakingLimit,
  EvmRemoveReferralPartner,
  EvmRemoveRewardProgram,
  EvmTopUpLegoProgram,
  EvmTopUpReferralPartners,
  EvmTopUpRewardPrograms,
  NodeOperatorsRegistry,
  ERC20,
  RewardProgramRegistry,
  ReferralPartnersRegistry,
};

export enum MotionType {
  NodeOperatorIncreaseLimit = 'Increase node operator staking limit',
  LEGOTopUp = 'Top up LEGO',
  RewardProgramAdd = 'Add reward program',
  RewardProgramRemove = 'Remove reward program',
  RewardProgramTopUp = 'Top up reward program',
  ReferralPartnerAdd = 'Add referral partner',
  ReferralPartnerRemove = 'Remove referral partner',
  ReferralPartnerTopUp = 'Top up referral partner',
}

export const factoryToMotionType = {
  '0xfebd8fac16de88206d4b18764e826af38546afe0':
    MotionType.NodeOperatorIncreaseLimit,
  '0x648c8be548f43eca4e482c0801ebccccfb944931': MotionType.LEGOTopUp,
  '0x9d15032b91d01d5c1d940eb919461426ab0dd4e3': MotionType.RewardProgramAdd,
  '0xc21e5e72ffc223f02fc410aaede3084a63963932': MotionType.RewardProgramRemove,
  '0x77781a93c4824d2299a38ac8bbb11eb3cd6bc3b7': MotionType.RewardProgramTopUp,
  '0x929547490ceb6aeedd7d72f1ab8957c0210b6e51': MotionType.ReferralPartnerAdd,
  '0xe9eb838fb3a288bf59e9275ccd7e124fdff88a9c':
    MotionType.ReferralPartnerRemove,
  '0x54058ee0e0c87ad813c002262cd75b98a7f59218': MotionType.ReferralPartnerTopUp,
};

export const MotionTypeEvmContractAbi = {
  [MotionType.NodeOperatorIncreaseLimit]:
    abi.EvmIncreaseNodeOperatorStakingLimit,
  [MotionType.LEGOTopUp]: abi.EvmTopUpLegoProgram,
  [MotionType.RewardProgramAdd]: abi.EvmAddRewardProgram,
  [MotionType.RewardProgramTopUp]: abi.EvmTopUpRewardPrograms,
  [MotionType.RewardProgramRemove]: abi.EvmRemoveRewardProgram,
  [MotionType.ReferralPartnerAdd]: abi.EvmAddReferralPartner,
  [MotionType.ReferralPartnerTopUp]: abi.EvmTopUpReferralPartners,
  [MotionType.ReferralPartnerRemove]: abi.EvmRemoveReferralPartner,
};

export interface MotionCreatedEventArgs {
  _motionId: BigNumber;
  _creator: string;
  _evmScriptFactory: string;
  _evmScriptCallData: string;
  _evmScript: string;
}
