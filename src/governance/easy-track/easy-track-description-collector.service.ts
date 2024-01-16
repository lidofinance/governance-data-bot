import { abi, MotionType, MotionTypeEvmContractAbi } from './easy-track.constants';
import { EasyTrackProvider } from './easy-track.provider';
import { formatEther, getAddress, formatUnits } from 'ethers/lib/utils';
import { Injectable } from '@nestjs/common';
import { EasyTrackConfig } from './easy-track.config';
import { BigNumber, BigNumberish } from 'ethers';

@Injectable()
export class EasyTrackDescriptionCollector {
  constructor(private easyTrackProvider: EasyTrackProvider, private config: EasyTrackConfig) {}

  private getLegoTokenOptions(symbol) {
    return [
      {
        label: 'ETH',
        value: '0x0000000000000000000000000000000000000000',
      },
      {
        label: symbol,
        value: this.config.get('governanceToken'),
      },
      {
        label: 'stETH',
        value: this.config.get('stETH'),
      },
    ];
  }

  getEtherscanAddressLink(name: string, address: string) {
    return `[${name}](<${this.config.get('etherscanBaseUrl')}address/${address}>)`;
  }

  getRecipientsRegistryAddress(type: MotionType) {
    return this.config.get<Record<MotionType, string | undefined>>(
      'motionTypeToRecipientsRegistryAddress',
    )[type];
  }

  formatToken(amount: BigNumber, decimals: BigNumberish): string {
    const amountStr = formatUnits(amount, decimals);

    const formatter = new Intl.NumberFormat('en', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });

    return formatter.format(parseFloat(amountStr));
  }

  async getMotionDescription(evmScriptFactory: string, evmScriptCallData?: string) {
    const type = this.config
      .get<Map<string, MotionType>>('factoryToMotionType')
      .get(evmScriptFactory);
    if (!type) return '';
    const contract = await this.easyTrackProvider.getContract(
      evmScriptFactory,
      MotionTypeEvmContractAbi[type],
    );
    const decoded = await contract.decodeEVMScriptCallData(evmScriptCallData);

    return this.MotionTypeDescriptionDecoders[type](decoded, type);
  }

  MotionTypeDescriptionDecoders: Record<
    MotionType,
    (args: any, motionType: MotionType) => Promise<string> | string
  > = {
    [MotionType.NodeOperatorIncreaseLimit]: (args) => this.descNodeOperatorIncreaseLimit(args),
    [MotionType.LEGOTopUp]: (args) => this.descLEGOTopUp(args),
    [MotionType.RewardProgramAdd]: (args) => this.descRewardProgramAdd(args),
    [MotionType.RewardProgramTopUp]: (args) => this.descRewardProgramTopUp(args),
    [MotionType.RewardProgramRemove]: (args) => this.descRewardProgramRemove(args),
    [MotionType.ReferralPartnerAdd]: (args) => this.descReferralPartnerAdd(args),
    [MotionType.ReferralPartnerTopUp]: (args) => this.descReferralPartnerTopUp(args),
    [MotionType.ReferralPartnerRemove]: (args) => this.descReferralPartnerRemove(args),
    [MotionType.AddAllowedRecipientReWARDS]: (args) => this.descAddAllowedRecipient(args),
    [MotionType.RemoveAllowedRecipientReWARDS]: (args) => this.descRemoveAllowedRecipient(args),
    [MotionType.TopUpAllowedRecipientsReWARDS]: (args) =>
      this.descTopUpAllowedRecipientsReWARDS(args),
    [MotionType.TopUpAllowedRecipientsLegoLDO]: (args) =>
      this.descTopUpAllowedRecipientsLegoLDO(args),
    [MotionType.TopUpAllowedRecipientsLegoDAI]: (args) =>
      this.descTopUpAllowedRecipientsLegoDAI(args),
    [MotionType.TopUpAllowedRecipientsRccDAI]: this.descTopUpAllowedRecipientsDAI,
    [MotionType.TopUpAllowedRecipientsPmlDAI]: this.descTopUpAllowedRecipientsDAI,
    [MotionType.TopUpAllowedRecipientsAtcDAI]: this.descTopUpAllowedRecipientsDAI,
    [MotionType.TopUpAllowedRecipientsGasETH]: (args) =>
      this.descTopUpAllowedRecipientsGasETH(args),
    [MotionType.AddAllowedRecipientReferralProgramDAI]: (args) =>
      this.descAddAllowedRecipientReferralProgramDAI(args),
    [MotionType.RemoveAllowedRecipientReferralProgramDAI]: (args) =>
      this.descRemoveAllowedRecipientReferralProgramDAI(args),
    [MotionType.TopUpAllowedRecipientsReferralProgramDAI]: (args) =>
      this.descTopUpAllowedRecipientsReferralProgramDAI(args),
    [MotionType.TopUpAllowedRecipientsTRP]: (args) => this.descTopUpAllowedRecipientsTRP(args),
    [MotionType.AddAllowedRecipientStETH]: (args) => this.descAddAllowedRecipientStETH(args),
    [MotionType.RemoveAllowedRecipientStETH]: (args) => this.descRemoveAllowedRecipientStETH(args),
    [MotionType.TopUpAllowedRecipientsStETH]: this.descTopUpAllowedRecipientsStETH,
    [MotionType.AddAllowedRecipientGasStETH]: (args) => this.descAddAllowedRecipientGasStETH(args),
    [MotionType.RemoveAllowedRecipientGasStETH]: (args) =>
      this.descRemoveAllowedRecipientGasStETH(args),
    [MotionType.TopUpAllowedRecipientsGasStETH]: (args) =>
      this.descTopUpAllowedRecipientsGasStETH(args),
    [MotionType.TopUpAllowedRecipientsRccStETH]: this.descTopUpAllowedRecipientsStETH,
    [MotionType.TopUpAllowedRecipientsPmlStETH]: this.descTopUpAllowedRecipientsStETH,
    [MotionType.TopUpAllowedRecipientsAtcStETH]: this.descTopUpAllowedRecipientsStETH,
    [MotionType.TopUpAllowedRecipientsRccStables]: this.descTopUpAllowedRecipientsStables,
    [MotionType.TopUpAllowedRecipientsPmlStables]: this.descTopUpAllowedRecipientsStables,
    [MotionType.TopUpAllowedRecipientsAtcStables]: this.descTopUpAllowedRecipientsStables,
  };

  private async descNodeOperatorIncreaseLimit([_nodeOperatorId, _stakingLimit]) {
    const { name } = await this.easyTrackProvider.getNodeOperatorInfo(_nodeOperatorId);
    return (
      `Node operator ${name} (id: ${_nodeOperatorId.toNumber()}) wants` +
      ` to increase staking limit to ${_stakingLimit.toNumber()}`
    );
  }

  private async descLEGOTopUp([_rewardTokens, _amounts]) {
    const { symbol } = await this.easyTrackProvider.getGovernanceTokenInfo();
    const options = this.getLegoTokenOptions(symbol);
    const labels = _rewardTokens.map(
      (address) => options.find((o) => getAddress(o.value) === getAddress(address))?.label,
    );

    return (
      `Top up LEGO program with: ` +
      _rewardTokens
        .map(
          (_, i) =>
            `${formatEther(_amounts[i])} ` +
            (labels[i] ? `${labels[i]}` : `tokens with address ${_rewardTokens[i]}`),
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
          this.config.get('rewardProgramRegistry'),
          address,
        );
        return `${name} with address ${address} with ${formatEther(_amounts[index])} ${symbol}`;
      }),
    );

    return `Top up reward programs: ${results.join('; ')}`;
  }

  private async descRewardProgramRemove(_rewardProgram) {
    const name = await this.easyTrackProvider.getProgramName(
      abi.RewardProgramRegistry,
      this.config.get('rewardProgramRegistry'),
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
          this.config.get('referralPartnersRegistry'),
          address,
        );
        return `${name} with address ${address} with ${formatEther(_amounts[index])} ${symbol}`;
      }),
    );

    return `Top up referral partners: ${results.join('; ')}`;
  }

  private async descReferralPartnerRemove(_referralPartner) {
    const name = await this.easyTrackProvider.getProgramName(
      abi.ReferralPartnersRegistry,
      this.config.get('referralPartnersRegistry'),
      _referralPartner,
    );
    return `Remove referral partner ${name} with address ${_referralPartner}`;
  }

  private async descAddAllowedRecipient([_recipient, _recipientName]) {
    return `Add allowed recipient ${this.getEtherscanAddressLink(_recipientName, _recipient)}`;
  }

  private async descRemoveAllowedRecipient(_recipient) {
    return `Remove allowed recipient ${this.getEtherscanAddressLink(_recipient, _recipient)}`;
  }

  private async descTopUpAllowedRecipientsReWARDS([_recipients, _amounts]) {
    const { symbol } = await this.easyTrackProvider.getGovernanceTokenInfo();

    const results = await Promise.all(
      _recipients.map(async (address, index) => {
        const name = await this.easyTrackProvider.getRecipientName({
          AbiRegistry: abi.AllowedRecipientsRegistryReWARDS,
          contractAddress: this.config.get('allowedRecipientsReWARDSRegistryAddress'),
          address: address,
        });
        return `${this.getEtherscanAddressLink(name, address)} with **${formatEther(
          _amounts[index],
        )} ${symbol}**`;
      }),
    );

    return `Top up recipients:\n${results.join(';\n')}`;
  }

  private async descTopUpAllowedRecipientsLegoLDO([_recipients, _amounts]) {
    const results = await Promise.all(
      _recipients.map(async (address, index) => {
        const name = await this.easyTrackProvider.getRecipientName({
          AbiRegistry: abi.AllowedRecipientsRegistryLegoLDO,
          contractAddress: this.config.get('allowedRecipientsLegoLDORegistryAddress'),
          address: address,
        });
        return `${this.getEtherscanAddressLink(name, address)} with **${formatEther(
          _amounts[index],
        )} LDO**`;
      }),
    );

    return `Top up recipients:\n${results.join(';\n')}`;
  }

  private async descTopUpAllowedRecipientsLegoDAI([_recipients, _amounts]) {
    const results = await Promise.all(
      _recipients.map(async (address, index) => {
        const name = await this.easyTrackProvider.getRecipientName({
          AbiRegistry: abi.AllowedRecipientsRegistryLegoDAI,
          contractAddress: this.config.get('allowedRecipientsLegoDAIRegistryAddress'),
          address: address,
        });
        return `${this.getEtherscanAddressLink(name, address)} with **${formatEther(
          _amounts[index],
        )} DAI**`;
      }),
    );

    return `Top up recipients:\n${results.join(';\n')}`;
  }

  private async descTopUpAllowedRecipientsDAI([_recipients, _amounts], type: MotionType) {
    const registryAddress = this.getRecipientsRegistryAddress(type);

    const results = await Promise.all(
      _recipients.map(async (address, index) => {
        const name = await this.easyTrackProvider.getRecipientName({
          AbiRegistry: abi.AllowedRecipientsRegistryDAI,
          contractAddress: registryAddress,
          address: address,
        });
        return `${this.getEtherscanAddressLink(name, address)} with **${formatEther(
          _amounts[index],
        )} DAI**`;
      }),
    );

    return `Top up recipients:\n${results.join(';\n')}`;
  }

  private async descTopUpAllowedRecipientsGasETH([_recipients, _amounts]) {
    const results = await Promise.all(
      _recipients.map(async (address, index) => {
        const name = await this.easyTrackProvider.getRecipientName({
          AbiRegistry: abi.AllowedRecipientsRegistryGasETH,
          contractAddress: this.config.get('allowedRecipientsGasETHRegistryAddress'),
          address: address,
        });
        return `${this.getEtherscanAddressLink(name, address)} with **${formatEther(
          _amounts[index],
        )} ETH**`;
      }),
    );

    return `Top up recipients:\n${results.join(';\n')}`;
  }

  private async descAddAllowedRecipientReferralProgramDAI([_recipient, _recipientName]) {
    return `Add allowed recipient ${this.getEtherscanAddressLink(_recipientName, _recipient)}`;
  }

  private async descRemoveAllowedRecipientReferralProgramDAI(_recipient) {
    return `Remove allowed recipient ${this.getEtherscanAddressLink(_recipient, _recipient)}`;
  }

  private async descTopUpAllowedRecipientsReferralProgramDAI([_recipients, _amounts]) {
    const results = _recipients.map((address, index) => {
      return `${this.getEtherscanAddressLink(address, address)} with **${formatEther(
        _amounts[index],
      )} DAI**`;
    });

    return `Top up recipients:\n${results.join(';\n')}`;
  }

  private async descTopUpAllowedRecipientsTRP([_recipients, _amounts]) {
    const results = await Promise.all(
      _recipients.map(async (address, index) => {
        const name = await this.easyTrackProvider.getRecipientName({
          AbiRegistry: abi.AllowedRecipientsRegistryTRP,
          contractAddress: this.config.get('allowedRecipientsTRPRegistryAddress'),
          address: address,
        });
        return `${this.getEtherscanAddressLink(name, address)} with **${formatEther(
          _amounts[index],
        )} LDO**`;
      }),
    );

    return `Top up recipients:\n${results.join(';\n')}`;
  }

  private async descAddAllowedRecipientStETH([_recipient, _recipientName]) {
    return `Add allowed recipient ${this.getEtherscanAddressLink(_recipientName, _recipient)}`;
  }

  private async descRemoveAllowedRecipientStETH(_recipient) {
    return `Remove allowed recipient ${this.getEtherscanAddressLink(_recipient, _recipient)}`;
  }

  private async descTopUpAllowedRecipientsStETH([_recipients, _amounts], type: MotionType) {
    const registryAddress = this.getRecipientsRegistryAddress(type);

    const results = await Promise.all(
      _recipients.map(async (address, index) => {
        const name = await this.easyTrackProvider.getRecipientName({
          AbiRegistry: abi.AllowedRecipientsRegistryStETH,
          contractAddress: registryAddress,
          address,
        });
        return `${this.getEtherscanAddressLink(name, address)} with **${formatEther(
          _amounts[index],
        )} stETH**`;
      }),
    );
    return `Top up recipients:\n${results.join(';\n')}`;
  }

  private async descAddAllowedRecipientGasStETH([_recipient, _recipientName]) {
    return `Add allowed recipient ${this.getEtherscanAddressLink(_recipientName, _recipient)}`;
  }

  private async descRemoveAllowedRecipientGasStETH(_recipient) {
    return `Remove allowed recipient ${this.getEtherscanAddressLink(_recipient, _recipient)}`;
  }

  private async descTopUpAllowedRecipientsGasStETH([_recipients, _amounts]) {
    const results = await Promise.all(
      _recipients.map(async (address, index) => {
        const name = await this.easyTrackProvider.getRecipientName({
          AbiRegistry: abi.AllowedRecipientsRegistryGasStETH,
          contractAddress: this.config.get('allowedRecipientsGasStETHRegistryAddress'),
          address: address,
        });
        return `${this.getEtherscanAddressLink(name, address)} with **${formatEther(
          _amounts[index],
        )} stETH**`;
      }),
    );
    return `Top up recipients:\n${results.join(';\n')}`;
  }

  private async descTopUpAllowedRecipientsStables(
    [_token, _recipients, _amounts],
    type: MotionType,
  ) {
    const registryAddress = this.getRecipientsRegistryAddress(type);

    const { decimals, symbol } = await this.easyTrackProvider.getTokenMetadata(_token);
    const results = await Promise.all(
      _recipients.map(async (address, index) => {
        const name = await this.easyTrackProvider.getRecipientName({
          AbiRegistry: abi.AllowedRecipientsRegistryStables,
          contractAddress: registryAddress,
          address,
        });
        return `${this.getEtherscanAddressLink(name, address)} with **${this.formatToken(
          _amounts[index],
          decimals,
        )} ${symbol}**`;
      }),
    );

    return `Top up recipients:\n${results.join(';\n')}`;
  }
}
