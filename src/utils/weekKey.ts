// src/utils/weekKey.ts
const STORAGE_KEY = "weekly-records";

/** 월 기준 주차 계산 (1~5) */
export function getWeekOfMonth(date: Date): number {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayWeek = firstDay.getDay() || 7; // 일요일=7
  const offset = firstDayWeek - 1;
  return Math.ceil((date.getDate() + offset) / 7);
}

/** YYYY-MM-weekN */
export function getWeekKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const w = getWeekOfMonth(date);
  return `${y}-${m}-week${w}`;
}

/** 오늘 기준 주차 */
export function getCurrentWeekKey(): string {
  return getWeekKey(new Date());
}

/** 월별 최대 주차 계산 */
export function getMaxWeekOfMonth(year: number, month: number): number {
  const lastDay = new Date(year, month, 0); // month는 1-based
  return getWeekOfMonth(lastDay);
}

/** 표시용 라벨 */
export function getWeekLabel(key: string): string {
  const [, m, w] = key.match(/-(\d{2})-week(\d+)/) ?? [];
  return `${Number(m)}월 ${Number(w)}주차`;
}

/** 저장된 주차 키 */
export function getStoredWeekKeys(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return Object.keys(JSON.parse(raw));
  } catch {
    return [];
  }
}

/** 월별 그룹 */
export function groupWeekKeysByMonth(keys: string[]) {
  return keys.reduce<Record<string, string[]>>((acc, key) => {
    const [y, m] = key.split("-");
    const group = `${y}-${m}`;
    acc[group] ??= [];
    acc[group].push(key);
    return acc;
  }, {});
}

/** 주차 키 오름차순 정렬 (YYYY-MM-weekN 기준) */
export function sortWeekKeysAsc(keys: string[]): string[] {
  return [...keys].sort((a, b) => {
    const [, am, aw] = a.match(/-(\d{2})-week(\d+)/) ?? [];
    const [, bm, bw] = b.match(/-(\d{2})-week(\d+)/) ?? [];
    if (am !== bm) return Number(am) - Number(bm);
    return Number(aw) - Number(bw);
  });
}

/** 오늘 날짜 문자열 (YYYY.MM.DD) */
export function getTodayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

// 오늘 날짜 기준 주차 key 생성 (중복 방지)
export function createWeekKeyByToday(): string {
  return getWeekKey(new Date());
}

export { STORAGE_KEY };
