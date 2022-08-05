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
