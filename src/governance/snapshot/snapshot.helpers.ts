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
