/** 요일 그룹: 월수금 / 화목토 */
export type DayGroupKey = "monWedFri" | "tueThuSat";

/** 교시: 1, 2, 3 */
export type PeriodKey = "period1" | "period2" | "period3";

/** 진도 (직접 입력 텍스트) */
export interface Progress {
  reading?: string;
  listening?: string;
  grammar?: string;
}

/** 교시별 숙제 한 행 */
export interface HomeworkEntry {
  name: string;
  wordScore: string | null; // ✅ 텍스트
  homeworkScore: number | null; // ✅ 숫자
  reason: string;
  issue: string;
  missedTodos: { text: string; done: boolean }[];
  _newTodo: string;
}

/** 교시별 수업 기록 (특이사항, 진도, 숙제) */
export interface PeriodRecord {
  /** 교시 메모 */
  note?: string;

  /** 진도/상태 정보 */
  progress?: Partial<Progress>;

  /** 교시마다 사용자가 입력한 학생 이름 + 점수 */
  homework?: HomeworkEntry[];
}
/** 요일 그룹별 교시 기록 */
export interface DayGroupSchedule {
  period1?: PeriodRecord;
  period2?: PeriodRecord;
  period3?: PeriodRecord;
}

/** 주차별 스케줄 (월수금 + 화목토) */
export interface Schedule {
  monWedFri?: DayGroupSchedule;
  tueThuSat?: DayGroupSchedule;
}

/** 학생별 주간 요약 */
export interface StudentSummaryEntry {
  reasonBelow100: string; // 활성화(active=true) 된 사유만 모은 배열
  weeklyIssue: string;
}
export interface WeekRecord {
  schedule: {
    monWedFri?: {
      period1?: PeriodRecord;
      period2?: PeriodRecord;
      period3?: PeriodRecord;
    };
    tueThuSat?: {
      period1?: PeriodRecord;
      period2?: PeriodRecord;
      period3?: PeriodRecord;
    };
  };
}

/** LocalStorage 전체 데이터 */
export type WeeklyRecords = Record<string, WeekRecord>;
