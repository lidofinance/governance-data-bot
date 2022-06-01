import {
  ARAGON_ADDITIONAL_LINK_TEMPLATE,
  ARAGON_LINK_TEMPLATE,
} from './aragon.constants';
import { AragonVote } from './aragon.provider';
import { VoteStatus } from '../vote.entity';

export function templateVoteLink(aragonVoteId) {
  return ARAGON_LINK_TEMPLATE + aragonVoteId + '/';
}

export function templateAdditionalVoteLink(aragonVoteId) {
  return ARAGON_ADDITIONAL_LINK_TEMPLATE + aragonVoteId + '/';
}

export function aragonVoteStatus(vote: AragonVote) {
  if (!vote) return null;
  if (vote.open && !vote.executed) return VoteStatus.active;
  if (!vote.open && vote.executed) return VoteStatus.enacted;
  if (!vote.open && !vote.executed && vote.canExecute)
    return VoteStatus.pending;
  if (!vote.open && !vote.executed && !vote.canExecute)
    return VoteStatus.rejected;
}
