const STORAGE_KEY = "weekly-records";

/** 날짜로부터 해당 주의 월요일 날짜 구하기 (ISO 주: 월요일 시작) */
function getMondayOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day; // 일요일이면 -6, 월요일이면 0
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

/** 주차 키 생성: "2024-02-week1" (해당 주 월요일 기준 월-weekN) */
export function getWeekKey(date: Date): string {
  const monday = getMondayOfWeek(date);
  const year = monday.getFullYear();
  const month = monday.getMonth() + 1;
  const startOfYear = new Date(year, 0, 1);
  const firstMonday = getMondayOfWeek(startOfYear);
  const weekNum = Math.floor((monday.getTime() - firstMonday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
  return `${year}-${String(month).padStart(2, "0")}-week${weekNum}`;
}

/** 주차 키 → 표시용 라벨 (예: "2월 1주차") */
export function getWeekLabel(weekKey: string): string {
  const match = weekKey.match(/^(\d{4})-(\d{2})-week(\d+)$/);
  if (!match) return weekKey;
  const [, , month, week] = match;
  const m = parseInt(month, 10);
  return `${m}월 ${parseInt(week, 10)}주차`;
}

/** 주차 키 → 해당 주 월요일 날짜 "YYYY-MM-DD" (날짜 입력용) */
export function getWeekMondayDateString(weekKey: string): string {
  const match = weekKey.match(/^(\d{4})-(\d{2})-week(\d+)$/);
  if (!match) return "";
  const year = parseInt(match[1], 10);
  const weekNum = parseInt(match[3], 10);
  const startOfYear = new Date(year, 0, 1);
  const firstMonday = getMondayOfWeek(startOfYear);
  const monday = new Date(firstMonday);
  monday.setDate(firstMonday.getDate() + (weekNum - 1) * 7);
  const y = monday.getFullYear();
  const m = monday.getMonth() + 1;
  const d = monday.getDate();
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** 현재 날짜 기준 주차 키 */
export function getCurrentWeekKey(): string {
  return getWeekKey(new Date());
}

/** 오늘 날짜 "YYYY-MM-DD" (날짜 입력 기본값용) */
export function getTodayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** 저장된 모든 주차 키 목록 (정렬: 최신순) */
export function getStoredWeekKeys(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as Record<string, unknown>;
    return Object.keys(data).sort((a, b) => b.localeCompare(a));
  } catch {
    return [];
  }
}

export { STORAGE_KEY };
