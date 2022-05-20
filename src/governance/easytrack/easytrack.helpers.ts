import {
  EASYTRACK_LINK_TEMPLATE,
  factoryToMotionType,
  GOVERNANCE_TOKEN_ADDRESS,
  stETH_ADDRESS,
} from './easytrack.constants';
import { EasytrackEventInfo } from './easytrack.event.collector';
import { VoteStatus } from '../vote.entity';

export async function getEasytrackType(evmScriptFactory: string) {
  const name = factoryToMotionType[evmScriptFactory.toLowerCase()];
  return name ? name : 'Motion type placeholder';
}

export async function templateMotionLink(motionId) {
  return EASYTRACK_LINK_TEMPLATE + motionId + '/';
}

export async function getLegoTokenOptions(symbol) {
  return [
    {
      label: 'ETH',
      value: '0x0000000000000000000000000000000000000000',
    },
    {
      label: symbol,
      value: GOVERNANCE_TOKEN_ADDRESS,
    },
    {
      label: 'stETH',
      value: stETH_ADDRESS,
    },
  ];
}

// filter numeric keys from object and optional keys from excluded list
export function filterArgs(args: unknown, exclude = []) {
  return Object.keys(args)
    .filter((k: undefined) => isNaN(k) && !exclude.includes(k))
    .reduce((a, k) => ({ ...a, [k]: args[k] }), {});
}

export function eventAndDurationInfoToStatus(
  eventInfo: EasytrackEventInfo,
  startDate,
  duration,
) {
  if (eventInfo.passed) return VoteStatus.passed;
  if (eventInfo.cancelled) return VoteStatus.cancelled;
  if (eventInfo.enacted) return VoteStatus.enacted;
  if (eventInfo.rejected) return VoteStatus.rejected;
  if (eventInfo.created) {
    const now = Date.now();
    const destination = (startDate + duration) * 1000;
    if (now < destination) {
      return VoteStatus.active;
    }
    if (destination <= now) {
      return VoteStatus.pending;
    }
  }
}
