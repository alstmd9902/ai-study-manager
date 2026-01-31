// src/App.tsx
import { GraduationCap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ClassRecordForm } from "./components/ClassRecordForm";
import { DayGroupTabs } from "./components/DayGroupTabs";
import { PeriodTabs } from "./components/PeriodTabs";
import { WeeklyStudentSummary } from "./components/WeeklyStudentSummary";
import { WeekSelector } from "./components/WeekSelector";

import type { DayGroupKey, PeriodKey, PeriodRecord, WeekRecord } from "./types";
import { loadWeekRecord, saveWeekRecord } from "./utils/storage";
import { getCurrentWeekKey } from "./utils/weekKey";

const LAST_WEEK_KEY = "lastSelectedWeekKey";

function AppContent() {
  const [weekKey, setWeekKey] = useState(() => {
    const saved = localStorage.getItem(LAST_WEEK_KEY);
    return saved ?? getCurrentWeekKey();
  });
  const [record, setRecord] = useState<WeekRecord>(() =>
    loadWeekRecord(localStorage.getItem(LAST_WEEK_KEY) ?? getCurrentWeekKey())
  );
  const [dayGroup, setDayGroup] = useState<DayGroupKey>("monWedFri");
  const [period, setPeriod] = useState<PeriodKey>("period1");

  useEffect(() => {
    // weekKey가 바뀌면 해당 주차 record를 다시 로드
    setRecord(loadWeekRecord(weekKey));
  }, [weekKey]);

  useEffect(() => {
    if (weekKey) {
      localStorage.setItem(LAST_WEEK_KEY, weekKey);
    }
  }, [weekKey]);

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
          selectedDayGroup={dayGroup}
          selectedPeriod={period}
          onWeekChange={setWeekKey}
          onRecordLoad={loadRecord}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <AppContent />
    </>
  );
}
