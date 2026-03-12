import type { RecordDraft } from '@/features/records/model';

let latestRecordDraft: RecordDraft | null = null;

export function setLatestRecordDraft(draft: RecordDraft): void {
  latestRecordDraft = draft;
}

export function consumeLatestRecordDraft(): RecordDraft | null {
  const current = latestRecordDraft;
  latestRecordDraft = null;
  return current;
}
