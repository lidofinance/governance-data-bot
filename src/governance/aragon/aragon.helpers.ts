import {
  ARAGON_ADDITIONAL_LINK_TEMPLATE,
  ARAGON_LINK_TEMPLATE,
} from './aragon.constants';
import { AragonVote } from './aragon.provider';
import { VoteStatus } from '../vote.entity';
import { Logger } from '@nestjs/common';

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

export function formatDescription(desc: string) {
  if (desc.startsWith('Omnibus vote:')) {
    const findNumbers = /;(\d+)\)/gi;
    desc = desc
      .replace('Omnibus vote: 1)', 'Omnibus vote:\n1)')
      .replaceAll(findNumbers, (substring, args) => `;\n${args[0]})`);
  } else if (desc.startsWith("('Omnibus vote:")) {
    try {
      const parsedDesc = `[${desc.slice(1, -1)}]`.replaceAll("'", '"');
      desc = JSON.parse(parsedDesc)
        .join('\n')
        .replace('Omnibus vote: 1)', 'Omnibus vote:\n1)');
    } catch (error) {
      new Logger().debug(`Could not parse description ${desc}. Skipped...`);
    }
  }
  return desc;
}
