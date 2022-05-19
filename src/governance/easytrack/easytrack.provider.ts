import { JsonRpcProvider } from '@ethersproject/providers/src.ts/json-rpc-provider';
import { BigNumber, Contract } from 'ethers';
import {
  abi,
  EASYTRACK_CONTRACT_ADDRESS,
  GOVERNANCE_TOKEN_ADDRESS,
  GRAPHQL_MOTIONS_URL,
  NODE_OPERATORS_REGISTRY_ADDRESS,
} from './easytrack.constants';
import { filterArgs } from './easytrack.helpers';
import fetch from 'node-fetch';
import { formatEther } from 'ethers/lib/utils';

export class EasytrackProvider {
  constructor(private provider: JsonRpcProvider) {}

  async getContract(address: string, abi: any): Promise<Contract> {
    return new Contract(address, abi, this.provider);
  }

  async getNodeOperatorInfo(noId: number | BigNumber) {
    const contract = await this.getContract(
      NODE_OPERATORS_REGISTRY_ADDRESS,
      abi.NodeOperatorsRegistry,
    );
    const { active, name } = await contract.getNodeOperator(noId, true);
    return { active, name };
  }

  async getGovernanceTokenInfo() {
    const contract = await this.getContract(
      GOVERNANCE_TOKEN_ADDRESS,
      abi.ERC20,
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const totalSupply = await contract.totalSupply();
    const symbol = await contract.symbol();
    return { totalSupply, symbol };
  }

  async getProgramName(
    abiProgram: any,
    contractAddress: string,
    address: string,
  ) {
    const contract = await this.getContract(contractAddress, abiProgram);

    const filter = contract.filters.RewardProgramAdded(
      address.toLocaleLowerCase(),
    );
    const filtered = (await contract.queryFilter(filter)).filter(
      ({ removed }) => !removed,
    );

    const [item] = filtered.sort((a, b) => b.blockNumber - a.blockNumber);

    return item.args[1];
  }

  async getEvents(motionId?: number | string) {
    const contract = await this.getContract(
      EASYTRACK_CONTRACT_ADDRESS,
      abi.Easytrack,
    );
    const topics = [
      contract.filters.MotionCreated(),
      contract.filters.MotionEnacted(),
      contract.filters.MotionObjected(),
      contract.filters.MotionRejected(),
      contract.filters.MotionCanceled(),
    ].reduce((a, t) => {
      a.push(t.topics[0]);
      return a;
    }, []);
    const filter = contract.filters.MotionCreated(
      motionId && BigNumber.from(motionId),
    );
    filter.topics[0] = topics;

    return (
      (await contract.queryFilter(filter))
        // ensure right order
        .sort((a, b) => {
          const deltaBlock = a.blockNumber - b.blockNumber;
          const deltaTxIdx = a.transactionIndex - b.transactionIndex;
          return deltaBlock !== 0
            ? deltaBlock
            : deltaTxIdx !== 0
            ? deltaTxIdx
            : a.logIndex - b.logIndex;
        })
        // parse args
        .map((e) => {
          const fragment = contract.interface.getEvent(e.topics[0]);
          const args = contract.interface.decodeEventLog(
            fragment,
            e.data,
            e.topics,
          );
          return {
            name: fragment.name,
            blockNumber: e.blockNumber,
            id: args._motionId.toNumber(),
            args: filterArgs(args, ['_motionId']),
          };
        })
    );
  }

  async fetchPastMotionsByIds(ids: number[]) {
    return this.fetchPastMotions(`id_in: [${ids.join(' ')}]`);
  }
  async fetchPastMotionsByDate(fromDate: number) {
    return this.fetchPastMotions(`startDate_gt: ${fromDate}`);
  }

  async fetchPastMotions(whereCondition: string) {
    const query = `{motions(
  orderBy: startDate 
  orderDirection: desc 
  where: { status_in: ["CANCELED", "REJECTED", "ENACTED"]
           ${whereCondition} }) 
  {
    id
    evmScriptFactory
    creator
    duration
    startDate
    snapshotBlock
    objectionsThreshold
    objectionsAmount
    evmScriptHash
    evmScriptCalldata
    status
    enacted_at
    canceled_at
    rejected_at
  }
}`;
    const resp = await fetch(GRAPHQL_MOTIONS_URL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    if (!resp.ok)
      throw new Error(
        `Request ${resp.url} failed with ${
          resp.status
        } error: ${await resp.text()}`,
      );
    const respData = await resp.json();
    return respData.data.motions;
  }

  async getMotionProgress(objectionsThreshold, objectionsAmount) {
    const { totalSupply } = await this.getGovernanceTokenInfo();
    const threshold = objectionsThreshold / 100;
    const totalSupplyNumber = Number(formatEther(totalSupply));
    const amount = Number(formatEther(objectionsAmount));
    const thresholdAmount = (totalSupplyNumber * threshold) / 100;
    const objectionsPct = (amount / thresholdAmount) * 100;

    const onlyZeros = Math.ceil(1 - Math.log10(objectionsPct));
    const objectionsPctFormatted =
      onlyZeros > 1 && onlyZeros < Infinity
        ? objectionsPct.toFixed(onlyZeros - 1)
        : Math.round(objectionsPct * 100) / 100;

    return {
      thresholdPct: threshold,
      thresholdAmount,
      objectionsPct,
      objectionsAmount: amount,
      objectionsPctFormatted,
    };
  }
}
