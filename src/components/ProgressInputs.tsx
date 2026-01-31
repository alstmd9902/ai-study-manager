import type { Progress } from "../types";
import { BookOpen } from "lucide-react";

interface ProgressInputsProps {
  value: Partial<Progress>;
  onChange: (value: Partial<Progress>) => void;
}

const ITEMS: { key: keyof Progress; label: string; placeholder: string }[] = [
  { key: "reading", label: "리딩", placeholder: "리딩 진도 입력" },
  { key: "listening", label: "리스닝", placeholder: "리스닝 진도 입력" },
  { key: "grammar", label: "문법", placeholder: "문법 진도 입력" },
];

export function ProgressInputs({ value, onChange }: ProgressInputsProps) {
  const handleChange = (key: keyof Progress, text: string) => {
    onChange({ ...value, [key]: text || undefined });
  };

  return (
    <div className="space-y-3">
      <label
        className="flex items-center gap-2 font-medium"
        style={{ color: "var(--text-main)", fontSize: "1rem" }}
      >
        <BookOpen className="h-5 w-5" style={{ color: "var(--text-muted)" }} />
        진도 (직접 입력)
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        {ITEMS.map(({ key, label, placeholder }) => (
          <div key={key} className="flex flex-col gap-1">
            <span
              className="text-sm font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              {label}
            </span>
            <input
              type="text"
              value={value[key] ?? ""}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={placeholder}
              className="rounded-lg border px-3 py-2"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--text-main)",
                borderColor: "var(--border)",
                fontSize: "1rem",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
