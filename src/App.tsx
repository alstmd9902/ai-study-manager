/* eslint-disable react-hooks/set-state-in-effect */
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

const LAST_WEEK_KEY = "lastSelectedWeekKey";

function AppContent() {
  /** =========================
   *  현재 선택된 주차
   *  ========================= */
  const [weekKey, setWeekKey] = useState<string | undefined>(() => {
    const saved = localStorage.getItem(LAST_WEEK_KEY);
    return saved ?? undefined;
  });

  /** =========================
   *  현재 주차의 전체 기록
   *  ========================= */
  const [record, setRecord] = useState<WeekRecord>(() =>
    weekKey ? loadWeekRecord(weekKey) : { schedule: {} }
  );

  /** =========================
   *  요일 그룹 / 교시
   *  ========================= */
  const [dayGroup, setDayGroup] = useState<DayGroupKey>("monWedFri");
  const [period, setPeriod] = useState<PeriodKey>("period1");

  /** =========================
   *  주차 변경 시 record 재로드
   *  ========================= */
  useEffect(() => {
    const nextRecord = weekKey ? loadWeekRecord(weekKey) : { schedule: {} };

    setRecord(nextRecord);
  }, [weekKey]);

  /** =========================
   *  마지막 주차 저장
   *  ========================= */
  useEffect(() => {
    if (weekKey) {
      localStorage.setItem(LAST_WEEK_KEY, weekKey);
    }
  }, [weekKey]);

  /** =========================
   *  WeekSelector에서 호출
   *  ========================= */
  const loadRecord = useCallback((key?: string) => {
    if (!key) {
      setRecord({ schedule: {} });
      return;
    }
    setRecord(loadWeekRecord(key));
  }, []);

  /** =========================
   *  현재 선택된 교시 데이터
   *  ========================= */
  const periodRecord: PeriodRecord =
    record.schedule[dayGroup]?.[period] ?? ({} as PeriodRecord);

  /** =========================
   *  교시 데이터 업데이트
   *  ========================= */
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
    if (weekKey) {
      saveWeekRecord(weekKey, nextRecord);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* 헤더 */}
        <header className="flex items-center gap-3">
          <GraduationCap className="h-9 w-9" />
          <h1 className="text-2xl font-bold md:text-3xl">수업 관리</h1>
        </header>

        {/* ✅ 주차 선택 */}
        <WeekSelector
          currentWeekKey={weekKey}
          onWeekChange={setWeekKey}
          onRecordLoad={loadRecord}
        />

        {!weekKey && (
          <div className="rounded-lg border border-dashed p-6 text-center text-gray-500">
            주차를 먼저 추가해주세요.
          </div>
        )}

        {weekKey && (
          <>
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

            <WeeklyStudentSummary
              weekKey={weekKey}
              record={record}
              selectedDayGroup={dayGroup}
              selectedPeriod={period}
              onWeekChange={setWeekKey}
              onRecordLoad={loadRecord}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
