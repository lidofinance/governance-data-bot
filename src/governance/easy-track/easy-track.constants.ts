import * as ERC20 from './abi/ERC20.min.abi.json';
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
import * as ReferralPartnersRegistry from './abi/ReferralPartnersRegistry.abi.json';
import * as RewardProgramRegistry from './abi/RewardProgramRegistry.abi.json';
import * as AllowedRecipientsRegistryDAI from './abi/EvmAllowedRecipientsRegistryDAI.abi.json';

import * as AddAllowedRecipientReWARDS from './abi/EvmAddAllowedRecipientReWards.abi.json';
import * as AllowedRecipientsRegistryReWARDS from './abi/EvmAllowedRecipientsRegistryReWards.abi.json';
import * as RemoveAllowedRecipientReWARDS from './abi/EvmRemoveAllowedRecipientReWards.abi.json';
import * as TopUpAllowedRecipientsReWARDS from './abi/EvmTopUpAllowedRecipientsReWards.abi.json';

import * as AllowedRecipientsRegistryLegoLDO from './abi/EvmAllowedRecipientsRegistryLegoLDO.abi.json';
import * as TopUpAllowedRecipientsLegoLDO from './abi/EvmTopUpAllowedRecipientsLegoLDO.abi.json';

import * as AllowedRecipientsRegistryLegoDAI from './abi/EvmAllowedRecipientsRegistryLegoDAI.abi.json';
import * as TopUpAllowedRecipientsLegoDAI from './abi/EvmTopUpAllowedRecipientsLegoDAI.abi.json';

import * as TopUpAllowedRecipientsRccDAI from './abi/EvmTopUpAllowedRecipientsRccDAI.abi.json';

import * as TopUpAllowedRecipientsPmlDAI from './abi/EvmTopUpAllowedRecipientsPmlDAI.abi.json';

import * as TopUpAllowedRecipientsAtcDAI from './abi/EvmTopUpAllowedRecipientsAtcDAI.abi.json';

import * as AllowedRecipientsRegistryGasETH from './abi/EvmAllowedRecipientsRegistryGasETH.abi.json';
import * as TopUpAllowedRecipientsGasETH from './abi/EvmTopUpAllowedRecipientsGasETH.abi.json';

import * as AddAllowedRecipientReferralProgramDAI from './abi/EvmAddAllowedRecipientReferralProgramDAI.abi.json';
import * as AllowedRecipientsRegistryReferralProgramDAI from './abi/EvmAllowedRecipientsRegistryReferralProgramDAI.abi.json';
import * as RemoveAllowedRecipientReferralProgramDAI from './abi/EvmRemoveAllowedRecipientReferralProgramDAI.abi.json';
import * as TopUpAllowedRecipientsReferralProgramDAI from './abi/EvmTopUpAllowedRecipientsReferralProgramDAI.abi.json';

import * as AllowedRecipientsRegistryTRP from './abi/EvmAllowedRecipientsRegistryTRP.abi.json';
import * as TopUpAllowedRecipientsTRP from './abi/EvmTopUpAllowedRecipientsTRP.abi.json';

import * as AllowedRecipientsRegistryStETH from './abi/EvmAllowedRecipientsRegistryStETH.abi.json';
import * as AddAllowedRecipientStETH from './abi/EvmAddAllowedRecipientStETH.abi.json';
import * as RemoveAllowedRecipientStETH from './abi/EvmRemoveAllowedRecipientStETH.abi.json';
import * as TopUpAllowedRecipientsStETH from './abi/EvmTopUpAllowedRecipientsStETH.abi.json';

import * as AddGasSupplyAllowedRecipientStETH from './abi/EvmAddGasSupplyAllowedRecipientStETH.abi.json';
import * as AllowedRecipientsRegistryGasStETH from './abi/EvmAllowedRecipientsRegistryGasStETH.abi.json';
import * as RemoveGasSupplyAllowedRecipientStETH from './abi/EvmRemoveGasSupplyAllowedRecipientStETH.abi.json';
import * as TopUpGasSupplyAllowedRecipientsStETH from './abi/EvmTopUpGasSupplyAllowedRecipientsStETH.abi.json';
import * as TopUpAllowedRecipientsStables from './abi/EvmTopUpAllowedRecipientsStables.abi.json';

import { BigNumber } from 'ethers';

export const EASYTRACK_CONTRACT_ABI = EasyTrack;

export const abi = {
  EasyTrack,
  ERC20,
  RewardProgramRegistry,
  ReferralPartnersRegistry,
  NodeOperatorsRegistry,
  EvmAddRewardProgram,
  EvmIncreaseNodeOperatorStakingLimit,
  EvmRemoveRewardProgram,
  EvmTopUpLegoProgram,
  EvmTopUpRewardPrograms,
  EvmAddReferralPartner,
  EvmRemoveReferralPartner,
  EvmTopUpReferralPartners,
  AllowedRecipientsRegistryReWARDS,
  TopUpAllowedRecipientsReWARDS,
  AddAllowedRecipientReWARDS,
  RemoveAllowedRecipientReWARDS,
  AllowedRecipientsRegistryLegoLDO,
  TopUpAllowedRecipientsLegoLDO,
  AllowedRecipientsRegistryLegoDAI,
  TopUpAllowedRecipientsLegoDAI,
  AllowedRecipientsRegistryDAI,
  TopUpAllowedRecipientsRccDAI,
  TopUpAllowedRecipientsPmlDAI,
  TopUpAllowedRecipientsAtcDAI,
  AllowedRecipientsRegistryGasETH,
  TopUpAllowedRecipientsGasETH,
  AddAllowedRecipientReferralProgramDAI,
  AllowedRecipientsRegistryReferralProgramDAI,
  RemoveAllowedRecipientReferralProgramDAI,
  TopUpAllowedRecipientsReferralProgramDAI,
  AllowedRecipientsRegistryTRP,
  TopUpAllowedRecipientsTRP,
  AllowedRecipientsRegistryStETH,
  AddAllowedRecipientStETH,
  RemoveAllowedRecipientStETH,
  TopUpAllowedRecipientsStETH,
  AllowedRecipientsRegistryGasStETH,
  AddGasSupplyAllowedRecipientStETH,
  RemoveGasSupplyAllowedRecipientStETH,
  TopUpGasSupplyAllowedRecipientsStETH,
  TopUpAllowedRecipientsStables,
  AllowedRecipientsRegistryStables: AllowedRecipientsRegistryDAI,
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
  AddAllowedRecipientReWARDS = 'Add recipient (reWARDS)',
  RemoveAllowedRecipientReWARDS = 'Remove recipient (reWARDS)',
  TopUpAllowedRecipientsReWARDS = 'Top up recipients (reWARDS)',

  TopUpAllowedRecipientsLegoLDO = 'Top up recipients (Lego LDO)',
  TopUpAllowedRecipientsLegoDAI = 'Top up recipients (Lego DAI)',
  TopUpAllowedRecipientsRccDAI = 'Top up recipients (RCC DAI)',
  TopUpAllowedRecipientsPmlDAI = 'Top up recipients (PML DAI)',
  TopUpAllowedRecipientsAtcDAI = 'Top up recipients (ATC DAI)',
  TopUpAllowedRecipientsGasETH = 'Top up recipients (GAS ETH)',

  TopUpAllowedRecipientsReferralProgramDAI = 'Top up recipients (Referral Program DAI)',
  AddAllowedRecipientReferralProgramDAI = 'Add recipient (Referral Program DAI)',
  RemoveAllowedRecipientReferralProgramDAI = 'Remove recipient (Referral Program DAI)',

  TopUpAllowedRecipientsTRP = 'Top up recipients (TRP)',
  TopUpAllowedRecipientsStETH = 'Top up recipients (stETH)',
  AddAllowedRecipientStETH = 'Add recipient (stETH)',
  RemoveAllowedRecipientStETH = 'Remove recipient (stETH)',

  AddAllowedRecipientGasStETH = 'Add recipient (GAS stETH)',
  RemoveAllowedRecipientGasStETH = 'Remove recipient (GAS stETH)',
  TopUpAllowedRecipientsGasStETH = 'Top up recipient (GAS stETH)',

  TopUpAllowedRecipientsRccStETH = 'Top up recipients (RCC stETH)',
  TopUpAllowedRecipientsPmlStETH = 'Top up recipients (PML stETH)',
  TopUpAllowedRecipientsAtcStETH = 'Top up recipients (ATC stETH)',
  TopUpAllowedRecipientsRccStables = 'Top up recipients (RCC Stablecoins)',
  TopUpAllowedRecipientsPmlStables = 'Top up recipients (PML Stablecoins)',
  TopUpAllowedRecipientsAtcStables = 'Top up recipients (ATC Stablecoins)',
}

export const MotionTypeEvmContractAbi: Record<MotionType, any> = {
  [MotionType.NodeOperatorIncreaseLimit]: abi.EvmIncreaseNodeOperatorStakingLimit,
  [MotionType.LEGOTopUp]: abi.EvmTopUpLegoProgram,
  [MotionType.RewardProgramAdd]: abi.EvmAddRewardProgram,
  [MotionType.RewardProgramTopUp]: abi.EvmTopUpRewardPrograms,
  [MotionType.RewardProgramRemove]: abi.EvmRemoveRewardProgram,
  [MotionType.ReferralPartnerAdd]: abi.EvmAddReferralPartner,
  [MotionType.ReferralPartnerTopUp]: abi.EvmTopUpReferralPartners,
  [MotionType.ReferralPartnerRemove]: abi.EvmRemoveReferralPartner,
  [MotionType.AddAllowedRecipientReWARDS]: abi.AddAllowedRecipientReWARDS,
  [MotionType.RemoveAllowedRecipientReWARDS]: abi.RemoveAllowedRecipientReWARDS,
  [MotionType.TopUpAllowedRecipientsReWARDS]: abi.TopUpAllowedRecipientsReWARDS,
  [MotionType.TopUpAllowedRecipientsLegoLDO]: abi.TopUpAllowedRecipientsLegoLDO,
  [MotionType.TopUpAllowedRecipientsLegoDAI]: abi.TopUpAllowedRecipientsLegoDAI,
  [MotionType.TopUpAllowedRecipientsRccDAI]: abi.TopUpAllowedRecipientsRccDAI,
  [MotionType.TopUpAllowedRecipientsPmlDAI]: abi.TopUpAllowedRecipientsPmlDAI,
  [MotionType.TopUpAllowedRecipientsAtcDAI]: abi.TopUpAllowedRecipientsAtcDAI,
  [MotionType.TopUpAllowedRecipientsGasETH]: abi.TopUpAllowedRecipientsGasETH,
  [MotionType.TopUpAllowedRecipientsReferralProgramDAI]:
    abi.TopUpAllowedRecipientsReferralProgramDAI,
  [MotionType.RemoveAllowedRecipientReferralProgramDAI]:
    abi.RemoveAllowedRecipientReferralProgramDAI,
  [MotionType.AddAllowedRecipientReferralProgramDAI]: abi.AddAllowedRecipientReferralProgramDAI,
  [MotionType.TopUpAllowedRecipientsTRP]: abi.TopUpAllowedRecipientsTRP,
  [MotionType.AddAllowedRecipientStETH]: abi.AddAllowedRecipientStETH,
  [MotionType.RemoveAllowedRecipientStETH]: abi.RemoveAllowedRecipientStETH,
  [MotionType.TopUpAllowedRecipientsStETH]: abi.TopUpAllowedRecipientsStETH,
  [MotionType.AddAllowedRecipientGasStETH]: abi.AddGasSupplyAllowedRecipientStETH,
  [MotionType.RemoveAllowedRecipientGasStETH]: abi.RemoveGasSupplyAllowedRecipientStETH,
  [MotionType.TopUpAllowedRecipientsGasStETH]: abi.TopUpGasSupplyAllowedRecipientsStETH,
  [MotionType.TopUpAllowedRecipientsRccStETH]: abi.TopUpAllowedRecipientsStETH,
  [MotionType.TopUpAllowedRecipientsPmlStETH]: abi.TopUpAllowedRecipientsStETH,
  [MotionType.TopUpAllowedRecipientsAtcStETH]: abi.TopUpAllowedRecipientsStETH,
  [MotionType.TopUpAllowedRecipientsRccStables]: abi.TopUpAllowedRecipientsStables,
  [MotionType.TopUpAllowedRecipientsPmlStables]: abi.TopUpAllowedRecipientsStables,
  [MotionType.TopUpAllowedRecipientsAtcStables]: abi.TopUpAllowedRecipientsStables,
};

export interface MotionCreatedEventArgs {
  _motionId: BigNumber;
  _creator: string;
  _evmScriptFactory: string;
  _evmScriptCallData: string;
  _evmScript: string;
}
