import type { WeekRecord, Schedule, DayGroupKey, PeriodKey } from "../types";

/** 해당 주차의 모든 교시에서 등장한 학생 이름 수집 (중복 제거, 빈 이름 제외) */
export function getUniqueStudentNamesFromWeek(record: WeekRecord): string[] {
  const names = new Set<string>();
  const dayGroups: DayGroupKey[] = ["monWedFri", "tueThuSat"];
  const periods: PeriodKey[] = ["period1", "period2", "period3"];
  const schedule: Schedule = record.schedule ?? {};

  for (const dg of dayGroups) {
    const group = schedule[dg];
    if (!group) continue;
    for (const p of periods) {
      const rec = group[p];
      const homework = rec?.homework;
      if (!homework) continue;
      if (Array.isArray(homework)) {
        homework.forEach((entry) => {
          if (entry.name?.trim()) names.add(entry.name.trim());
        });
      }
    }
  }
  return Array.from(names).sort();
}
