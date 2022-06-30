import { Injectable } from '@nestjs/common';
import { AragonProviderService } from './aragon.provider.service';
import { BigNumber, Contract } from 'ethers';
import { abi } from './aragon.constants';
import { EventFilter } from '@ethersproject/contracts/src.ts';
import { aragonVoteStatus } from './aragon.helpers';
import { VoteStatus } from '../vote.entity';
import { AragonConfig, AragonNetworkConfig } from './aragon.config';

export interface AragonVote {
  id: number;
  open: boolean;
  executed: boolean;
  startDate: BigNumber;
  voteTime: BigNumber;
  executionBlock: number;
  snapshotBlock: BigNumber;
  supportRequired: BigNumber;
  minAcceptQuorum: BigNumber;
  yea: BigNumber;
  nay: BigNumber;
  votingPower: BigNumber;
  script: string;
  canExecute: boolean;
  creator: string;
  metadata: string;
}

interface StartVoteEvent {
  voteId: BigNumber;
  creator: string;
  metadata: string;
}

@Injectable()
export class AragonProvider {
  private config: AragonNetworkConfig;
  constructor(
    private providerService: AragonProviderService,
    private aragonConfig: AragonConfig,
  ) {
    this.config = aragonConfig.render();
  }

  async getContract(address: string, abi: any): Promise<Contract> {
    return new Contract(address, abi, this.providerService);
  }

  async getVotingContract() {
    return await this.getContract(this.config.votingContract, abi.AragonVoting);
  }

  async getBlockDate(blockNumber: number) {
    return (await this.providerService.getBlock(blockNumber)).timestamp * 1000;
  }

  async getEventArgs<T extends { voteId: BigNumber }>(
    contract: Contract,
    filter: EventFilter,
  ): Promise<{ [key: number]: { args: T; blockNumber: number } }> {
    const events = {};
    (await contract.queryFilter(filter)).map((e) => {
      events[e.args.voteId.toNumber()] = {
        args: e.args,
        blockNumber: e.blockNumber,
      };
    });
    return events;
  }

  async getVotesByDate(date: number) {
    const contract = await this.getVotingContract();
    const startEvents = await this.getEventArgs<StartVoteEvent>(
      contract,
      contract.filters.StartVote(),
    );
    const executeEvents = await this.getEventArgs(
      contract,
      contract.filters.ExecuteVote(),
    );
    let lastVoteId = (await contract.votesLength()) - 1;
    const voteTime = await contract.voteTime();
    const votes: AragonVote[] = [];
    let vote: AragonVote;
    do {
      vote = await contract.getVote(lastVoteId);
      const canExecute = await contract.canExecute(lastVoteId);
      votes.push({
        ...vote,
        id: lastVoteId,
        creator: startEvents[lastVoteId].args.creator,
        metadata: startEvents[lastVoteId].args.metadata,
        executionBlock: executeEvents[lastVoteId]?.blockNumber,
        voteTime,
        canExecute,
      });
      lastVoteId--;
    } while (Number(vote.startDate) > date);
    return votes;
  }

  async getVotesByIds(ids: number[]) {
    const contract = await this.getVotingContract();
    const startEvents = await this.getEventArgs<StartVoteEvent>(
      contract,
      contract.filters.StartVote(),
    );
    const executeEvents = await this.getEventArgs(
      contract,
      contract.filters.ExecuteVote(),
    );
    const notExecutedIds = Object.keys(startEvents)
      .filter((item) => executeEvents[item] === undefined)
      .map((item) => Number(item));
    const voteTime = await contract.voteTime();
    const votes: AragonVote[] = [];
    for (const id of new Set([...ids, ...notExecutedIds])) {
      let vote = await contract.getVote(id);
      const canExecute = await contract.canExecute(id);
      vote = {
        ...vote,
        id,
        creator: startEvents[id].args.creator,
        metadata: startEvents[id].args.metadata,
        executionBlock: executeEvents[id]?.blockNumber,
        voteTime,
        canExecute,
      };
      if (aragonVoteStatus(vote) !== VoteStatus.rejected || ids.indexOf(id) > 0)
        votes.push(vote);
    }
    return votes;
  }
}
