export interface VoteEntity {
  // All date fields are ISO string
  source: VoteSources;
  status: VoteStatus;
  name: string;
  type?: string;
  description?: string;
  startDate: string;
  endDate: string;
  executionEndDate?: string;
  link: string;
  objectionsAmount?: number;
  objectionsThreshold?: number;
  result1?: number;
  result2?: number;
  result3?: number;
  proposalType?: string;
  discussion?: string;
}

export enum VoteSources {
  easyTrack = 'EasyTrack',
  snapshot = 'Snapshot',
}

export enum VoteStatus {
  active = 'active',
  pending = 'pending',
  passed = 'passed',
  enacted = 'enacted',
  cancelled = 'cancelled',
  rejected = 'rejected',
  closed = 'closed',
}

export function formatDate(date: Date | number | string): string | null {
  return date ? new Date(new Date(date).setSeconds(0)).toISOString() : null;
}

export function votesIsEqual(vote1: VoteEntity, vote2: VoteEntity): boolean {
  return Object.keys(vote1).every((key) => vote1[key] === vote2[key]);
}
