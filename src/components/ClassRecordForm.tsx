import type { DayGroupKey, PeriodKey, PeriodRecord } from "../types";
import { HomeworkTable } from "./HomeworkTable";
import { ProgressInputs } from "./ProgressInputs";
import { SpecialNoteInput } from "./SpecialNoteInput";

interface ClassRecordFormProps {
  record: PeriodRecord;
  onUpdate: (record: PeriodRecord) => void;
  dayGroup: DayGroupKey;
  period: PeriodKey;
  currentWeekKey?: string;
}

const PERIOD_NUMBER_MAP: Record<PeriodKey, 1 | 2 | 3> = {
  period1: 1,
  period2: 2,
  period3: 3
};

export function ClassRecordForm({
  record,
  onUpdate,
  period
}: ClassRecordFormProps) {
  const note = record.note ?? "";
  const progress = record.progress ?? {};
  const homework = record.homework ?? [];

  const handleNote = (value: string) => {
    onUpdate({ ...record, note: value || undefined });
  };
  const handleProgress = (value: typeof progress) => {
    onUpdate({ ...record, progress: value });
  };
  const handleHomework = (value: typeof homework) => {
    onUpdate({ ...record, homework: value });
  };

  return (
    <div
      className="space-y-6 rounded-xl p-5 shadow-sm"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)"
      }}
    >
      <SpecialNoteInput value={note} onChange={handleNote} />
      <ProgressInputs value={progress} onChange={handleProgress} />
      <HomeworkTable
        homework={homework}
        onChange={handleHomework}
        period={PERIOD_NUMBER_MAP[period]}
      />
    </div>
  );
}
