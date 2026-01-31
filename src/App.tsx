// src/App.tsx
import { GraduationCap } from "lucide-react";
import { useCallback, useState } from "react";
import { ClassRecordForm } from "./components/ClassRecordForm";
import { DayGroupTabs } from "./components/DayGroupTabs";
import { PeriodTabs } from "./components/PeriodTabs";
import { WeeklyStudentSummary } from "./components/WeeklyStudentSummary";
import { WeekSelector } from "./components/WeekSelector";
import { ThemeProvider } from "./contexts/ThemeContext";
import type { DayGroupKey, PeriodKey, PeriodRecord, WeekRecord } from "./types";
import { loadWeekRecord, saveWeekRecord } from "./utils/storage";
import { getCurrentWeekKey } from "./utils/weekKey";

function AppContent() {
  const [weekKey, setWeekKey] = useState(getCurrentWeekKey);
  const [record, setRecord] = useState<WeekRecord>(() =>
    loadWeekRecord(getCurrentWeekKey())
  );
  const [dayGroup, setDayGroup] = useState<DayGroupKey>("monWedFri");
  const [period, setPeriod] = useState<PeriodKey>("period1");

  const loadRecord = useCallback((key: string) => {
    setRecord(loadWeekRecord(key));
  }, []);

  const periodRecord =
    record.schedule[dayGroup]?.[period] ?? ({} as PeriodRecord);

  const updatePeriodRecord = (next: PeriodRecord) => {
    const nextRecord: WeekRecord = {
      ...record,
      schedule: {
        ...record.schedule,
        [dayGroup]: {
          ...record.schedule[dayGroup],
          [period]: next
        }
      }
    };
    setRecord(nextRecord);
    saveWeekRecord(weekKey, nextRecord);
  };

  // ✅ 학생 주간 요약은 App이 관리
  const updateStudentSummary = (
    summary: Record<string, { reasonBelow100: string; weeklyIssue: string }>
  ) => {
    const nextRecord: WeekRecord = {
      ...record,
      studentSummary: summary
    };
    setRecord(nextRecord);
    saveWeekRecord(weekKey, nextRecord);
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center gap-3">
          <GraduationCap className="h-9 w-9" />
          <h1 className="text-2xl font-bold md:text-3xl">수업 관리</h1>
        </header>

        <WeekSelector
          currentWeekKey={weekKey}
          onWeekChange={setWeekKey}
          onRecordLoad={loadRecord}
        />

        <section className="space-y-4">
          <DayGroupTabs active={dayGroup} onChange={setDayGroup} />
          <PeriodTabs active={period} onChange={setPeriod} />
          <ClassRecordForm
            record={periodRecord}
            onUpdate={updatePeriodRecord}
            dayGroup={dayGroup}
            period={period}
          />
        </section>

        {/* ✅ 여기만 엑셀 버튼 있음 */}
        <WeeklyStudentSummary
          weekKey={weekKey}
          record={record}
          summary={record.studentSummary ?? {}}
          onSummaryChange={updateStudentSummary}
          onWeekChange={setWeekKey}
          onRecordLoad={loadRecord}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
