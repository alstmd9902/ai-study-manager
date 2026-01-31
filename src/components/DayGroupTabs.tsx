import type { DayGroupKey } from "../types";
import { getTodayDateString } from "../utils/weekKey";

interface DayGroupTabsProps {
  active: DayGroupKey;
  onChange: (key: DayGroupKey) => void;
}

const TABS: { key: DayGroupKey; label: string }[] = [
  { key: "monWedFri", label: "월/수/금" },
  { key: "tueThuSat", label: "화/목/토" }
];

/** 오늘 날짜 YYYY.MM.DD (보기용, 수정·선택 없음) */
function TodayDisplay() {
  const dateStr = getTodayDateString();
  const display = dateStr.replace(/-/g, ".");
  return (
    <p
      className="mb-2 text-sm"
      style={{ color: "var(--text-muted)" }}
      aria-label="오늘 날짜"
    >
      {display}
    </p>
  );
}

export function DayGroupTabs({ active, onChange }: DayGroupTabsProps) {
  return (
    <div>
      <TodayDisplay />
      <div
        className="flex gap-1 rounded-lg p-3"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)"
        }}
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className="rounded-md px-4 py-2 font-medium transition-colors"
            style={{
              fontSize: "1rem",
              ...(active === key
                ? {
                    backgroundColor: "var(--surface)",
                    color: "var(--text-main)",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.76)"
                  }
                : {
                    color: "#3d3d3d8a"
                  })
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
