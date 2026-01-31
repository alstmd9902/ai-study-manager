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
  wordScore: string | null;
  homeworkScore: number | null;

  /** 100% 미만 사유 */
  reason?: string;

  /** 이번 주 이슈 */
  issue: string;

  /** 못한 숙제 체크리스트 */
  missedTodos?: {
    text: string;
    done: boolean;
  }[];

  /** 못한 숙제 입력 중 텍스트 */
  _newTodo?: string;
}

/** 교시별 수업 기록 (특이사항, 진도, 숙제) */
export interface PeriodRecord {
  note?: string;
  progress?: Partial<Progress>;
  /** 교시마다 사용자가 입력한 학생 이름 + 점수 (순서 유지) */
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

/** 주차 단위 데이터 */
export interface WeekRecord {
  schedule: Schedule;
  studentSummary?: Record<
    string,
    {
      reasonBelow100: string;
      weeklyIssue: string;
    }
  >;
}

/** LocalStorage 전체 데이터 */
export type WeeklyRecords = Record<string, WeekRecord>;
