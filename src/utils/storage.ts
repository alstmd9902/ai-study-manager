import type { PeriodRecord, WeekRecord, WeeklyRecords } from "../types";
import { STORAGE_KEY } from "./weekKey";

/** 빈 주차 데이터 */
export function createEmptyWeekRecord(): WeekRecord {
  return {
    schedule: {
      monWedFri: { period1: {}, period2: {}, period3: {} },
      tueThuSat: { period1: {}, period2: {}, period3: {} }
    },
    // studentSummary is initialized as an empty object.
    // When populated, each key will have both required fields: reasonBelow100 and weeklyIssue as strings.
    studentSummary: {}
  };
}

/** 예전 형식(Record) → 새 형식(HomeworkEntry[]) 변환 */
function normalizePeriodRecord(rec: PeriodRecord): PeriodRecord {
  const homework = rec.homework;
  if (!homework) return rec;
  if (Array.isArray(homework)) return rec;
  const entries = Object.entries(homework as Record<string, number | null>).map(
    ([name, score]) => ({
      name,
      wordScore: null,
      homeworkScore: score,
      reason: "",
      issue: "",
      missedTodos: []
    })
  );
  return {
    ...rec,
    homework: entries
  };
}

/** 주차 기록 내 모든 period의 homework를 새 형식으로 정규화 */
function normalizeWeekRecord(record: WeekRecord): WeekRecord {
  const schedule = record.schedule ?? {};
  const monWedFri = schedule.monWedFri ?? {};
  const tueThuSat = schedule.tueThuSat ?? {};

  // Normalize studentSummary so every entry has both reasonBelow100 and weeklyIssue as strings.
  const summary = record.studentSummary ?? {};
  const normalizedStudentSummary = Object.fromEntries(
    Object.entries(summary).map(([name, s]) => [
      name,
      {
        reasonBelow100: s?.reasonBelow100 ?? "",
        weeklyIssue: s?.weeklyIssue ?? ""
      }
    ])
  );

  return {
    ...record,
    schedule: {
      monWedFri: {
        period1: normalizePeriodRecord(monWedFri.period1 ?? {}),
        period2: normalizePeriodRecord(monWedFri.period2 ?? {}),
        period3: normalizePeriodRecord(monWedFri.period3 ?? {})
      },
      tueThuSat: {
        period1: normalizePeriodRecord(tueThuSat.period1 ?? {}),
        period2: normalizePeriodRecord(tueThuSat.period2 ?? {}),
        period3: normalizePeriodRecord(tueThuSat.period3 ?? {})
      }
    },
    studentSummary: normalizedStudentSummary
  };
}

/** LocalStorage에서 전체 데이터 읽기 */
export function loadWeeklyRecords(): WeeklyRecords {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as WeeklyRecords;
  } catch {
    return {};
  }
}

/** 특정 주차 데이터 읽기 (없으면 빈 데이터, 예전 형식은 자동 변환) */
export function loadWeekRecord(weekKey: string): WeekRecord {
  const all = loadWeeklyRecords();
  const existing = all[weekKey];
  if (!existing) return createEmptyWeekRecord();
  return normalizeWeekRecord(existing);
}

/** 특정 주차 데이터 저장 (merge) */
export function saveWeekRecord(weekKey: string, record: WeekRecord): void {
  const all = loadWeeklyRecords();
  all[weekKey] = record;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

/** 주차 삭제 */
export function deleteWeekRecord(weekKey: string): void {
  const all = loadWeeklyRecords();
  delete all[weekKey];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
