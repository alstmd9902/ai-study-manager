import { Calendar, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  createEmptyWeekRecord,
  deleteWeekRecord,
  saveWeekRecord
} from "../utils/storage";
import { getStoredWeekKeys, getWeekLabel } from "../utils/weekKey";

interface WeekSelectorProps {
  currentWeekKey?: string;
  onWeekChange: (weekKey?: string) => void;
  onRecordLoad: (weekKey?: string) => void;
}

export function WeekSelector({
  currentWeekKey,
  onWeekChange,
  onRecordLoad
}: WeekSelectorProps) {
  const [weekOptions, setWeekOptions] = useState<string[]>(() => {
    const keys = getStoredWeekKeys() ?? [];
    return [...keys].sort((a, b) => a.localeCompare(b));
  });

  const handleTabClick = (key: string) => {
    onWeekChange(key);
    onRecordLoad(key);
  };

  return (
    <WeekTabs
      weekOptions={weekOptions}
      setWeekOptions={setWeekOptions}
      currentWeekKey={currentWeekKey}
      onTabClick={handleTabClick}
      onRecordLoad={onRecordLoad}
      onWeekChange={onWeekChange}
    />
  );
}

/** 주차 탭 + 다중 선택 삭제 */
function WeekTabs({
  weekOptions,
  setWeekOptions,
  currentWeekKey,
  onTabClick,
  onRecordLoad,
  onWeekChange
}: {
  weekOptions: string[];
  setWeekOptions: React.Dispatch<React.SetStateAction<string[]>>;
  currentWeekKey?: string;
  onTabClick: (key: string) => void;
  onRecordLoad: (key?: string) => void;
  onWeekChange: (key?: string) => void;
}) {
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const allSelected =
    weekOptions.length > 0 && weekOptions.every((k) => selectedKeys.has(k));

  const toggleSelect = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedKeys(allSelected ? new Set() : new Set(weekOptions));
  };

  const handleDeleteSelected = () => {
    if (selectedKeys.size === 0) {
      setDeleteMode(false);
      return;
    }

    if (
      !confirm(
        `선택한 ${selectedKeys.size}개 주차를 삭제할까요? (기록이 모두 삭제됩니다.)`
      )
    ) {
      return;
    }

    // 1) 스토리지에서 실제 삭제
    selectedKeys.forEach((key) => deleteWeekRecord(key));

    // 2) 스토리지 기준으로 최신 주차 목록 재조회
    const remainingKeys = getStoredWeekKeys().sort((a, b) =>
      a.localeCompare(b)
    );

    // 3) UI 상태 즉시 반영
    setWeekOptions(remainingKeys);
    setSelectedKeys(new Set());
    setDeleteMode(false);

    // 4) 현재 선택 주차가 삭제되었으면 App에 즉시 반영
    if (!currentWeekKey || !remainingKeys.includes(currentWeekKey)) {
      if (remainingKeys.length > 0) {
        const nextKey = remainingKeys[0];
        onWeekChange(nextKey);
        onRecordLoad(nextKey);
      } else {
        // 주차가 하나도 없으면 선택 초기화
        onWeekChange(undefined);
        onRecordLoad(undefined);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteMode(false);
    setSelectedKeys(new Set());
  };

  const handleAddWeek = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth() + 1; // 1~12
    const day = today.getDate();

    // 해당 월의 1일 요일
    const firstDay = new Date(year, month - 1, 1).getDay();

    const getMaxWeeksInMonth = (y: number, m: number) => {
      const first = new Date(y, m - 1, 1).getDay();
      const last = new Date(y, m, 0).getDate();
      return Math.ceil((first + last) / 7);
    };

    let nextYear = year;
    let nextMonth = month;

    let maxWeeks = getMaxWeeksInMonth(nextYear, nextMonth);
    let nextWeek = Math.ceil((firstDay + day) / 7);
    if (nextWeek > maxWeeks) nextWeek = maxWeeks;

    let nextKey = `${nextYear}-${String(nextMonth).padStart(2, "0")}-week${nextWeek}`;

    // 🔴 이미 존재하면 → 계속 다음 주차 탐색
    while (weekOptions.includes(nextKey)) {
      if (nextWeek < maxWeeks) {
        nextWeek += 1;
      } else {
        // 다음 달로 이동
        nextWeek = 1;
        if (nextMonth === 12) {
          nextMonth = 1;
          nextYear += 1;
        } else {
          nextMonth += 1;
        }
        maxWeeks = getMaxWeeksInMonth(nextYear, nextMonth);
      }

      nextKey = `${nextYear}-${String(nextMonth).padStart(2, "0")}-week${nextWeek}`;
    }

    // 이미 또 있으면 아무것도 안 함 (중복 방지)
    if (weekOptions.includes(nextKey)) {
      onWeekChange(nextKey);
      onRecordLoad(nextKey);
      return;
    }

    // ✅ 새 주차 생성
    saveWeekRecord(nextKey, createEmptyWeekRecord());

    setWeekOptions((prev) =>
      [...prev, nextKey].sort((a, b) => a.localeCompare(b))
    );

    onWeekChange(nextKey);
    onRecordLoad(nextKey);
  };

  //월별 묶음 UI 표시 로직
  const groupWeeksByMonth = (weeks: string[]) => {
    const groups: Record<string, string[]> = {};

    weeks.forEach((key) => {
      const [year, month] = key.split("-"); // 2026, 02
      const label = `${year}년 ${Number(month)}월`;

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(key);
    });

    return groups;
  };
  const monthGroups = groupWeeksByMonth(weekOptions);

  return (
    <div
      className="rounded-xl p-4 shadow-sm"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)"
      }}
    >
      {/* 헤더 */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Calendar className="h-5 w-5" style={{ color: "var(--text-muted)" }} />
        <span className="font-medium" style={{ color: "var(--text-main)" }}>
          주차
        </span>

        {!deleteMode ? (
          <>
            <button
              type="button"
              onClick={() => setDeleteMode(true)}
              className="ml-auto text-red-500 rounded-lg border px-3 py-2 text-sm hover:bg-red-500 hover:text-amber-50"
              style={{
                borderColor: "var(--border)"
              }}
            >
              <Trash2 className="inline h-4 w-4 mr-1" />
              주차 삭제
            </button>
            <button
              type="button"
              onClick={handleAddWeek}
              className="ml-2 text-green-700 rounded-lg border px-3 py-2 text-sm hover:bg-green-500 hover:text-amber-50"
              style={{
                borderColor: "var(--border)"
              }}
            >
              + 주차 추가
            </button>
          </>
        ) : (
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={selectedKeys.size === 0}
              className="rounded-lg border px-3 py-2 text-sm text-white"
              style={{
                backgroundColor: "var(--danger)",
                opacity: selectedKeys.size === 0 ? 0.6 : 1
              }}
            >
              선택 삭제 ({selectedKeys.size})
            </button>
            <button
              type="button"
              onClick={handleCancelDelete}
              className="rounded-lg border px-3 py-2 text-sm"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)"
              }}
            >
              취소
            </button>
          </div>
        )}
      </div>

      {/* 전체 선택 */}
      {deleteMode && (
        <div className="mb-3 flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="h-4 w-4"
              style={{ accentColor: "var(--accent)" }}
            />
            전체 선택
          </label>
        </div>
      )}

      {/* 주차 목록 (월별 묶음 렌더링) */}
      <div className="flex flex-col gap-4">
        {Object.entries(monthGroups).map(([monthLabel, keys]) => (
          <div key={monthLabel}>
            {/* 월 제목 */}
            <div className="mb-2 text-sm font-semibold text-gray-600">
              {monthLabel}
            </div>

            {/* 해당 월의 주차들 */}
            <div className="flex flex-wrap gap-2">
              {keys.map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-all"
                  style={{
                    borderColor: "var(--border)",
                    borderWidth: "1px",
                    backgroundColor: "var(--surface)",
                    fontWeight: currentWeekKey === key ? 600 : 400,
                    color:
                      currentWeekKey === key
                        ? "var(--text-main)"
                        : "rgba(0,0,0,0.35)",
                    outline:
                      currentWeekKey === key
                        ? "2px solid var(--accent)"
                        : "none",
                    outlineOffset: "-1px",
                    transform:
                      currentWeekKey === key
                        ? "translateY(1px)"
                        : "translateY(-1px)",
                    boxShadow:
                      currentWeekKey === key
                        ? "inset 0 2px 4px rgba(0,0,0,0.25)"
                        : "0 4px 8px rgba(0,0,0,0.15)"
                  }}
                >
                  {deleteMode ? (
                    <>
                      <input
                        type="checkbox"
                        checked={selectedKeys.has(key)}
                        onChange={() => toggleSelect(key)}
                        className="h-4 w-4"
                        style={{ accentColor: "var(--accent)" }}
                      />
                      <span>{getWeekLabel(key)}</span>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onTabClick(key)}
                      className="font-medium"
                    >
                      {getWeekLabel(key)}
                    </button>
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
