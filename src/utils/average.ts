import type { HomeworkEntry, WeekRecord } from "../types";

/**
 * 학생 한 명의 주간 숙제 평균 계산
 * - homeworkScore만 사용
 * - null 제외
 */
export function getStudentWeeklyAverage(
  record: WeekRecord,
  studentName: string
): number | null {
  const scores: number[] = [];

  const dayGroups = ["monWedFri", "tueThuSat"] as const;
  const periods = ["period1", "period2", "period3"] as const;

  for (const dg of dayGroups) {
    const group = record.schedule[dg];
    if (!group) continue;

    for (const p of periods) {
      const homework = group[p]?.homework;
      if (!Array.isArray(homework)) continue;

      for (const entry of homework as HomeworkEntry[]) {
        if (
          entry.name?.trim() === studentName.trim() &&
          typeof entry.homeworkScore === "number"
        ) {
          scores.push(entry.homeworkScore);
        }
      }
    }
  }

  if (scores.length === 0) return null;

  const sum = scores.reduce((a, b) => a + b, 0);
  return Math.round(sum / scores.length);
}

/**
 * 학생 한 명의 주간 사유 / 이슈 수집
 * - 숙제 섹션에서 입력한 값만 사용
 * - 학생 주간 요약에서는 조회 전용
 */
export function getStudentWeeklyNotes(
  record: WeekRecord,
  studentName: string
): {
  reasonBelow100: string;
  weeklyIssue: string;
  missedHomework: string[];
} {
  const reasons: string[] = [];
  const issues: string[] = [];
  const missedHomework: string[] = [];

  const dayGroups = ["monWedFri", "tueThuSat"] as const;
  const periods = ["period1", "period2", "period3"] as const;

  for (const dg of dayGroups) {
    const group = record.schedule[dg];
    if (!group) continue;

    for (const p of periods) {
      const homework = group[p]?.homework;
      if (!Array.isArray(homework)) continue;

      for (const entry of homework as HomeworkEntry[]) {
        if (entry.name?.trim() !== studentName.trim()) continue;

        if (typeof entry.reason === "string" && entry.reason.trim()) {
          reasons.push(entry.reason.trim());
        }

        if (typeof entry.issue === "string" && entry.issue.trim()) {
          issues.push(entry.issue);
        }
        if (Array.isArray(entry.missedTodos)) {
          const undoneTodos = entry.missedTodos
            .filter((t) => !t.done)
            .map((t) => t.text.trim())
            .filter(Boolean);

          missedHomework.push(...undoneTodos);
        }
      }
    }
  }

  return {
    reasonBelow100: reasons.join("\n"),
    weeklyIssue: issues.join("\n"),
    missedHomework
  };
}

/**
 * 특정 요일 그룹 + 교시 기준 평균
 * - homeworkScore만 사용
 * - null 제외
 */
export function getStudentPeriodAverage(
  record: WeekRecord,
  dayGroup: "monWedFri" | "tueThuSat",
  period: "period1" | "period2" | "period3",
  studentName: string
): number | null {
  const homework = record.schedule?.[dayGroup]?.[period]?.homework;
  if (!Array.isArray(homework)) return null;

  const scores: number[] = [];

  for (const entry of homework as HomeworkEntry[]) {
    if (
      entry.name?.trim() === studentName.trim() &&
      typeof entry.homeworkScore === "number"
    ) {
      scores.push(entry.homeworkScore);
    }
  }

  if (scores.length === 0) return null;

  const sum = scores.reduce((a, b) => a + b, 0);
  return Math.round(sum / scores.length);
}

/**
 * 특정 요일 그룹 + 교시 기준 사유 / 이슈 / 못한 숙제
 */
export function getStudentPeriodNotes(
  record: WeekRecord,
  dayGroup: "monWedFri" | "tueThuSat",
  period: "period1" | "period2" | "period3",
  studentName: string
): {
  reasonBelow100: string;
  weeklyIssue: string;
  missedHomework: string[];
} {
  const homework = record.schedule?.[dayGroup]?.[period]?.homework;
  if (!Array.isArray(homework)) {
    return {
      reasonBelow100: "",
      weeklyIssue: "",
      missedHomework: []
    };
  }

  const reasons: string[] = [];
  const issues: string[] = [];
  const missedHomework: string[] = [];

  for (const entry of homework as HomeworkEntry[]) {
    if (entry.name?.trim() !== studentName.trim()) continue;

    if (typeof entry.reason === "string" && entry.reason.trim()) {
      reasons.push(entry.reason.trim());
    }

    if (typeof entry.issue === "string" && entry.issue.trim()) {
      issues.push(entry.issue.trim());
    }

    if (Array.isArray(entry.missedTodos)) {
      const undone = entry.missedTodos
        .filter((t) => !t.done)
        .map((t) => t.text.trim())
        .filter(Boolean);

      missedHomework.push(...undone);
    }
  }

  return {
    reasonBelow100: reasons.join("\n"),
    weeklyIssue: issues.join("\n"),
    missedHomework
  };
}
