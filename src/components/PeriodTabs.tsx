import type { PeriodKey } from "../types";

interface PeriodTabsProps {
  active: PeriodKey;
  onChange: (key: PeriodKey) => void;
}

const TABS: { key: PeriodKey; label: string }[] = [
  { key: "period1", label: "1교시" },
  { key: "period2", label: "2교시" },
  { key: "period3", label: "3교시" }
];

const ACTIVE_BG: Record<PeriodKey, string> = {
  period1: "#2563eb", // blue
  period2: "#16a34a", // green
  period3: "#ec4899" // pink
};

export function PeriodTabs({ active, onChange }: PeriodTabsProps) {
  return (
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
          className="rounded-md px-3 py-1.5 font-medium transition-colors"
          style={{
            fontSize: "1rem",
            ...(active === key
              ? {
                  // 눌린 상태
                  backgroundColor: ACTIVE_BG[key],
                  color: "#ffffff",
                  transform: "translateY(1px)",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.25)"
                }
              : {
                  // 기본(떠 있는 상태)
                  backgroundColor: "var(--surface)",
                  color: "#3d3d3d8a",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
                })
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
