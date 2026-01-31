import { useState } from "react";
import { Calendar, Trash2 } from "lucide-react";
import {
  getWeekLabel,
  getStoredWeekKeys,
  getCurrentWeekKey,
} from "../utils/weekKey";
import { deleteWeekRecord } from "../utils/storage";

interface WeekSelectorProps {
  currentWeekKey: string;
  onWeekChange: (weekKey: string) => void;
  onRecordLoad: (weekKey: string) => void;
}

export function WeekSelector({
  currentWeekKey,
  onWeekChange,
  onRecordLoad,
}: WeekSelectorProps) {
  const storedKeys = getStoredWeekKeys();
  const hasCurrent = storedKeys.includes(currentWeekKey);
  const weekOptions =
    storedKeys.length > 0
      ? hasCurrent
        ? storedKeys
        : [currentWeekKey, ...storedKeys].sort((a, b) => b.localeCompare(a))
      : [getCurrentWeekKey()];

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

/** 삭제 모드 + 탭 목록 (주차 탭, 다중 선택 삭제) */
function WeekTabs({
  weekOptions,
  currentWeekKey,
  onTabClick,
  onRecordLoad,
  onWeekChange,
}: {
  weekOptions: string[];
  currentWeekKey: string;
  onTabClick: (key: string) => void;
  onRecordLoad: (key: string) => void;
  onWeekChange: (key: string) => void;
}) {
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const toggleSelect = (key: string) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
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
    const keys = getStoredWeekKeys();
    const remaining = keys.filter((k) => !selectedKeys.has(k));
    selectedKeys.forEach((key) => deleteWeekRecord(key));
    const nextCurrent =
      remaining[0] ?? (currentWeekKey && !selectedKeys.has(currentWeekKey) ? currentWeekKey : getCurrentWeekKey());
    const nextKey = remaining.includes(nextCurrent)
      ? nextCurrent
      : remaining[0] ?? getCurrentWeekKey();
    onWeekChange(nextKey);
    onRecordLoad(nextKey);
    setSelectedKeys(new Set());
    setDeleteMode(false);
  };

  const handleCancelDelete = () => {
    setDeleteMode(false);
    setSelectedKeys(new Set());
  };

  return (
    <div
      className="rounded-xl p-4 shadow-sm"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Calendar
          className="h-5 w-5"
          style={{ color: "var(--text-muted)" }}
        />
        <span
          className="font-medium"
          style={{ color: "var(--text-main)", fontSize: "1rem" }}
        >
          주차
        </span>
        {!deleteMode ? (
          <button
            type="button"
            onClick={() => setDeleteMode(true)}
            className="ml-auto flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--danger)",
              borderColor: "var(--border)",
            }}
          >
            <Trash2 className="h-4 w-4" />
            주차 삭제
          </button>
        ) : (
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={selectedKeys.size === 0}
              className="rounded-lg border px-3 py-2 text-sm font-medium"
              style={{
                backgroundColor: "var(--danger)",
                color: "#fff",
                borderColor: "var(--danger)",
                opacity: selectedKeys.size === 0 ? 0.6 : 1,
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
                color: "var(--text-main)",
                borderColor: "var(--border)",
              }}
            >
              취소
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {weekOptions.map((key) => (
          <label
            key={key}
            className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-colors"
            style={{
              borderColor:
                currentWeekKey === key ? "var(--accent)" : "var(--border)",
              backgroundColor:
                currentWeekKey === key ? "var(--surface-hover)" : "var(--surface)",
            }}
          >
            {deleteMode ? (
              <>
                <input
                  type="checkbox"
                  checked={selectedKeys.has(key)}
                  onChange={() => toggleSelect(key)}
                  className="h-4 w-4 rounded"
                  style={{ accentColor: "var(--accent)" }}
                />
                <span
                  style={{
                    color: "var(--text-main)",
                    fontSize: "0.9375rem",
                  }}
                >
                  {getWeekLabel(key)}
                </span>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onTabClick(key)}
                className="text-left font-medium"
                style={{
                  color: "var(--text-main)",
                  fontSize: "0.9375rem",
                }}
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
