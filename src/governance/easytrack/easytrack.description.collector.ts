import { JsonRpcProvider } from '@ethersproject/providers/src.ts/json-rpc-provider';
import {
  abi,
  factoryToMotionType,
  MotionType,
  MotionTypeEvmContractAbi,
  REFERRAL_PARTNERS_REGISTRY_ADDRESS,
  REWARD_PROGRAM_REGISTRY_ADDRESS,
} from './easytrack.constants';
import { EasytrackProvider } from './easytrack.provider';
import { getLegoTokenOptions } from './easytrack.helpers';
import { formatEther, getAddress } from 'ethers/lib/utils';

export class EasytrackDescriptionCollector {
  easytrackProvider: EasytrackProvider;

  constructor(private provider: JsonRpcProvider) {
    this.easytrackProvider = new EasytrackProvider(this.provider);
  }

  async getMotionDescription(
    evmScriptFactory: string,
    evmScriptCallData?: string,
  ) {
    const type = factoryToMotionType[evmScriptFactory.toLowerCase()];
    if (!type) return null;
    const contract = await this.easytrackProvider.getContract(
      evmScriptFactory,
      MotionTypeEvmContractAbi[type],
    );
    const decoded = await contract.decodeEVMScriptCallData(evmScriptCallData);

    return this.MotionTypeDescriptionDecoders[type](decoded);
  }

  MotionTypeDescriptionDecoders = {
    [MotionType.NodeOperatorIncreaseLimit]: (args) =>
      this.descNodeOperatorIncreaseLimit(args),
    [MotionType.LEGOTopUp]: (args) => this.descLEGOTopUp(args),
    [MotionType.RewardProgramAdd]: (args) => this.descRewardProgramAdd(args),
    [MotionType.RewardProgramTopUp]: (args) =>
      this.descRewardProgramTopUp(args),
    [MotionType.RewardProgramRemove]: (args) =>
      this.descRewardProgramRemove(args),
    [MotionType.ReferralPartnerAdd]: (args) =>
      this.descReferralPartnerAdd(args),
    [MotionType.ReferralPartnerTopUp]: (args) =>
      this.descReferralPartnerTopUp(args),
    [MotionType.ReferralPartnerRemove]: (args) =>
      this.descReferralPartnerRemove(args),
  };

  async descNodeOperatorIncreaseLimit([_nodeOperatorId, _stakingLimit]) {
    const { name } = await this.easytrackProvider.getNodeOperatorInfo(
      _nodeOperatorId,
    );
    return (
      `Node operator ${name} (id: ${_nodeOperatorId.toNumber()}) wants` +
      ` to increase staking limit to ${_stakingLimit.toNumber()}`
    );
  }

  async descLEGOTopUp([_rewardTokens, _amounts]) {
    const { symbol } = await this.easytrackProvider.getGovernanceTokenInfo();
    const options = await getLegoTokenOptions(symbol);
    const labels = _rewardTokens.map(
      (address) =>
        options.find((o) => getAddress(o.value) === getAddress(address))?.label,
    );

    return (
      `Top up LEGO program with: ` +
      _rewardTokens
        .map(
          (_, i) =>
            `${formatEther(_amounts[i])} ` +
            (labels[i]
              ? `${labels[i]}`
              : `tokens with address ${_rewardTokens[i]}`),
        )
        .join(`, `)
    );
  }

  async descRewardProgramAdd([_rewardProgram, _rewardProgramName]) {
    return `Add reward program ${_rewardProgramName} with address ${_rewardProgram}`;
  }

  async descRewardProgramTopUp([_rewardPrograms, _amounts]) {
    const { symbol } = await this.easytrackProvider.getGovernanceTokenInfo();

    const results = await Promise.all(
      _rewardPrograms.map(async (address, index) => {
        const name = await this.easytrackProvider.getProgramName(
          abi.RewardProgramRegistry,
          REWARD_PROGRAM_REGISTRY_ADDRESS,
          address,
        );
        return `${name} with address ${address} with ${formatEther(
          _amounts[index],
        )} ${symbol}`;
      }),
    );

    return `Top up reward programs: ${results.join('; ')}`;
  }

  async descRewardProgramRemove(_rewardProgram) {
    const name = await this.easytrackProvider.getProgramName(
      abi.RewardProgramRegistry,
      REWARD_PROGRAM_REGISTRY_ADDRESS,
      _rewardProgram,
    );
    return `Remove reward program ${name} with address ${_rewardProgram}`;
  }

  async descReferralPartnerAdd([_referralPartner, _referralPartnerName]) {
    return `Add referral partner ${_referralPartnerName} with address ${_referralPartner}`;
  }

  async descReferralPartnerTopUp([_referralPartners, _amounts]) {
    const { symbol } = await this.easytrackProvider.getGovernanceTokenInfo();

    const results = await Promise.all(
      _referralPartners.map(async (address, index) => {
        const name = await this.easytrackProvider.getProgramName(
          abi.ReferralPartnersRegistry,
          REFERRAL_PARTNERS_REGISTRY_ADDRESS,
          address,
        );
        return `${name} with address ${address} with ${formatEther(
          _amounts[index],
        )} ${symbol}`;
      }),
    );

    return `Top up referral partners: ${results.join('; ')}`;
  }

  async descReferralPartnerRemove(_referralPartner) {
    const name = await this.easytrackProvider.getProgramName(
      abi.ReferralPartnersRegistry,
      REFERRAL_PARTNERS_REGISTRY_ADDRESS,
      _referralPartner,
    );
    return `Remove referral partner ${name} with address ${_referralPartner}`;
  }
}
