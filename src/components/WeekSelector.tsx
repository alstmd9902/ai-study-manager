import { Calendar, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  createEmptyWeekRecord,
  deleteWeekRecord,
  saveWeekRecord
} from "../utils/storage";
import {
  getCurrentWeekKey,
  getStoredWeekKeys,
  getWeekLabel
} from "../utils/weekKey";

interface WeekSelectorProps {
  currentWeekKey: string;
  onWeekChange: (weekKey: string) => void;
  onRecordLoad: (weekKey: string) => void;
}

export function WeekSelector({
  currentWeekKey,
  onWeekChange,
  onRecordLoad
}: WeekSelectorProps) {
  // ✅ 항상 저장된 주차 기준 + 오름차순
  const weekOptions = getStoredWeekKeys().sort((a, b) => a.localeCompare(b));

  const handleTabClick = (key: string) => {
    onWeekChange(key);
    onRecordLoad(key);
  };

  return (
    <WeekTabs
      weekOptions={weekOptions}
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
  currentWeekKey,
  onTabClick,
  onRecordLoad,
  onWeekChange
}: {
  weekOptions: string[];
  currentWeekKey: string;
  onTabClick: (key: string) => void;
  onRecordLoad: (key: string) => void;
  onWeekChange: (key: string) => void;
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
    )
      return;

    selectedKeys.forEach((key) => deleteWeekRecord(key));

    const remaining = getStoredWeekKeys().filter((k) => !selectedKeys.has(k));

    const nextKey = remaining[0] ?? getCurrentWeekKey();

    onWeekChange(nextKey);
    onRecordLoad(nextKey);
    setSelectedKeys(new Set());
    setDeleteMode(false);
  };

  const handleCancelDelete = () => {
    setDeleteMode(false);
    setSelectedKeys(new Set());
  };

  // ✅ 월별 최대 주차 반영
  function getNextWeekKey(latestKey: string): string {
    const match = latestKey.match(/^(\d{4})-(\d{2})-week(\d)$/);
    if (!match) return getCurrentWeekKey();

    let year = parseInt(match[1], 10);
    let month = parseInt(match[2], 10);
    let week = parseInt(match[3], 10);

    const maxWeeksByMonth: Record<number, number> = {
      1: 5,
      2: 4,
      3: 5,
      4: 4,
      5: 5,
      6: 4,
      7: 5,
      8: 5,
      9: 4,
      10: 5,
      11: 4,
      12: 5
    };

    const maxWeek = maxWeeksByMonth[month] ?? 4;

    if (week < maxWeek) {
      week += 1;
    } else {
      week = 1;
      if (month === 12) {
        year += 1;
        month = 1;
      } else {
        month += 1;
      }
    }

    return `${year}-${month.toString().padStart(2, "0")}-week${week}`;
  }

  const handleAddWeek = () => {
    const latestKey =
      weekOptions.length > 0
        ? weekOptions[weekOptions.length - 1]
        : getCurrentWeekKey();

    const nextKey = getNextWeekKey(latestKey);

    // ✅ 타입 안전한 빈 주차 생성
    saveWeekRecord(nextKey, createEmptyWeekRecord());

    onWeekChange(nextKey);
    onRecordLoad(nextKey);
  };

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

      {/* 주차 목록 */}
      <div className="flex flex-wrap gap-2">
        {weekOptions.map((key) => (
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
                currentWeekKey === key ? "2px solid var(--accent)" : "none",
              outlineOffset: "-1px",
              transform:
                currentWeekKey === key ? "translateY(1px)" : "translateY(-1px)",
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
  );
}
