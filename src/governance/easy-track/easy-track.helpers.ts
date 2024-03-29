import { EasyTrackEventInfo } from './easy-track-event-collector.service';
import { VoteStatus } from '../vote.entity';
import { MotionType } from './easy-track.constants';

export async function getEasyTrackType(
  evmScriptFactory: string,
  factoryToMotionType: Map<string, MotionType>,
) {
  const name = factoryToMotionType.get(evmScriptFactory);
  return name ? name : 'Unknown motion type';
}

// filter numeric keys from object and optional keys from excluded list
export function filterArgs(args: unknown, exclude = []) {
  return Object.keys(args)
    .filter((k: undefined) => isNaN(k) && !exclude.includes(k))
    .reduce((a, k) => ({ ...a, [k]: args[k] }), {});
}

export function eventAndDurationInfoToStatus(eventInfo: EasyTrackEventInfo, startDate, duration) {
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
