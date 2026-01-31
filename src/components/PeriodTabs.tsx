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

export function PeriodTabs({ active, onChange }: PeriodTabsProps) {
  return (
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
          className="rounded-md px-3 py-1.5 font-medium transition-colors"
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
  );
}
