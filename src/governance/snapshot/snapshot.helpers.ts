import { GraphqlProposal } from './snapshot.graphql.service';
import { VoteStatus } from '../vote.entity';

export function proposalStateToVoteStatus(proposal: GraphqlProposal) {
  switch (proposal.state) {
    case 'active':
      return VoteStatus.active;
    case 'pending': {
      return VoteStatus.pending;
    }
    case 'closed': {
      return VoteStatus.closed;
    }
  }
}

export function uniqueProposals(proposals: GraphqlProposal[]) {
  return proposals.filter(
    (proposal, index, self) =>
      index === self.findIndex((value) => proposal.id === value.id),
  );
}

export function dateToUtc(date: string) {
  return new Date(date).toUTCString();
}

const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];

export function abbreviateNumber(number: number): string {
  // what tier? (determines SI symbol)
  const tier = (Math.log10(Math.abs(number)) / 3) | 0;

  // if zero, we don't need a suffix
  if (tier == 0) return Math.round(number).toString();

  // get suffix and determine scale
  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);

  // scale the number
  const scaled = number / scale;

  // format number and add suffix
  return scaled.toFixed(1) + suffix;
}

export const hourAgo = new Date();
hourAgo.setHours(new Date().getHours() - 1);
