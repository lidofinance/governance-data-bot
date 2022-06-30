import {
  abi,
  factoryToMotionType,
  MotionType,
  MotionTypeEvmContractAbi,
} from './easy-track.constants';
import { EasyTrackProvider } from './easy-track.provider';
import { formatEther, getAddress } from 'ethers/lib/utils';
import { Injectable } from '@nestjs/common';
import { EasyTrackConfig, EasyTrackNetworkConfig } from './easy-track.config';

@Injectable()
export class EasyTrackDescriptionCollector {
  private config: EasyTrackNetworkConfig;
  constructor(
    private easyTrackProvider: EasyTrackProvider,
    private easyTrackConfig: EasyTrackConfig,
  ) {
    this.config = easyTrackConfig.render();
  }

  private getLegoTokenOptions(symbol) {
    return [
      {
        label: 'ETH',
        value: '0x0000000000000000000000000000000000000000',
      },
      {
        label: symbol,
        value: this.config.governanceToken,
      },
      {
        label: 'stETH',
        value: this.config.stETH,
      },
    ];
  }

  async getMotionDescription(
    evmScriptFactory: string,
    evmScriptCallData?: string,
  ) {
    const type = factoryToMotionType[evmScriptFactory.toLowerCase()];
    if (!type) return null;
    const contract = await this.easyTrackProvider.getContract(
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

  private async descNodeOperatorIncreaseLimit([
    _nodeOperatorId,
    _stakingLimit,
  ]) {
    const { name } = await this.easyTrackProvider.getNodeOperatorInfo(
      _nodeOperatorId,
    );
    return (
      `Node operator ${name} (id: ${_nodeOperatorId.toNumber()}) wants` +
      ` to increase staking limit to ${_stakingLimit.toNumber()}`
    );
  }

  private async descLEGOTopUp([_rewardTokens, _amounts]) {
    const { symbol } = await this.easyTrackProvider.getGovernanceTokenInfo();
    const options = this.getLegoTokenOptions(symbol);
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

  private descRewardProgramAdd([_rewardProgram, _rewardProgramName]) {
    return `Add reward program ${_rewardProgramName} with address ${_rewardProgram}`;
  }

  private async descRewardProgramTopUp([_rewardPrograms, _amounts]) {
    const { symbol } = await this.easyTrackProvider.getGovernanceTokenInfo();

    const results = await Promise.all(
      _rewardPrograms.map(async (address, index) => {
        const name = await this.easyTrackProvider.getProgramName(
          abi.RewardProgramRegistry,
          this.config.rewardProgramRegistry,
          address,
        );
        return `${name} with address ${address} with ${formatEther(
          _amounts[index],
        )} ${symbol}`;
      }),
    );

    return `Top up reward programs: ${results.join('; ')}`;
  }

  private async descRewardProgramRemove(_rewardProgram) {
    const name = await this.easyTrackProvider.getProgramName(
      abi.RewardProgramRegistry,
      this.config.rewardProgramRegistry,
      _rewardProgram,
    );
    return `Remove reward program ${name} with address ${_rewardProgram}`;
  }

  private descReferralPartnerAdd([_referralPartner, _referralPartnerName]) {
    return `Add referral partner ${_referralPartnerName} with address ${_referralPartner}`;
  }

  private async descReferralPartnerTopUp([_referralPartners, _amounts]) {
    const { symbol } = await this.easyTrackProvider.getGovernanceTokenInfo();

    const results = await Promise.all(
      _referralPartners.map(async (address, index) => {
        const name = await this.easyTrackProvider.getProgramName(
          abi.ReferralPartnersRegistry,
          this.config.referralPartnersRegistry,
          address,
        );
        return `${name} with address ${address} with ${formatEther(
          _amounts[index],
        )} ${symbol}`;
      }),
    );

    return `Top up referral partners: ${results.join('; ')}`;
  }

  private async descReferralPartnerRemove(_referralPartner) {
    const name = await this.easyTrackProvider.getProgramName(
      abi.ReferralPartnersRegistry,
      this.config.referralPartnersRegistry,
      _referralPartner,
    );
    return `Remove referral partner ${name} with address ${_referralPartner}`;
  }
}
