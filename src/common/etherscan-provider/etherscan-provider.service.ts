import { Injectable } from '@nestjs/common';
import { Contract, providers } from 'ethers';
import { ExecutionProvider } from '../execution-provider';
import { PrometheusService } from '../prometheus';

@Injectable()
export class EtherscanProviderService {
  private contractCreationBlockCache = new Map<string, number>();
  private etherscanProvider: providers.EtherscanProvider;

  constructor(
    private executionProvider: ExecutionProvider,
    private prometheusService: PrometheusService,
  ) {
    this.etherscanProvider = new providers.EtherscanProvider(
      this.executionProvider.network,
    );
  }

  async getContractCreationBlock(contract: Contract): Promise<number> {
    if (this.contractCreationBlockCache.has(contract.address)) {
      return this.contractCreationBlockCache.get(contract.address);
    }
    const result = await this.fetch('contract', {
      action: 'getcontractcreation',
      contractaddresses: contract.address,
    });
    const blockNumber = (
      await this.executionProvider.getTransaction(result[0].txHash)
    ).blockNumber;
    this.contractCreationBlockCache.set(contract.address, blockNumber);
    return blockNumber;
  }

  async fetch(action: string, params: Record<string, string>) {
    this.prometheusService.externalServiceRequestsCount.inc({
      serviceName: EtherscanProviderService.name,
    });
    return this.etherscanProvider.fetch(action, params);
  }
}
