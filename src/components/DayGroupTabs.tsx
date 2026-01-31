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
        className="flex gap-3 rounded-lg p-3"
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
            className="rounded-md px-4 py-2 font-medium transition-all"
            style={{
              fontSize: "1rem",
              ...(active === key
                ? {
                    // 눌린 상태
                    color: "var(--text-main)",
                    transform: "translateY(1px)",
                    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.25)",
                    backgroundColor: "var(--surface)"
                  }
                : {
                    // 기본(떠 있는 상태)
                    color: "#3d3d3d7c",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                    backgroundColor: "var(--surface)"
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
