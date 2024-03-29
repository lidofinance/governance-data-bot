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
  additionalLink?: string;
  objectionsAmount?: number;
  objectionsThreshold?: number;
  result1?: number;
  result2?: number;
  result3?: number;
  result4?: number;
  proposalType?: string;
  discussion?: string;
  votersNumber?: number;
  choice1?: string;
  choice2?: string;
  choice3?: string;
  choice4?: string;
  flagged?: boolean;
}

export enum VoteSources {
  easyTrack = 'EasyTrack',
  snapshot = 'Snapshot',
  aragon = 'Aragon',
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
