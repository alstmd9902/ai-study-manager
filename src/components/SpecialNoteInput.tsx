import { FileText } from "lucide-react";

interface SpecialNoteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SpecialNoteInput({
  value,
  onChange,
  placeholder = "결석, 보충일자, 기타 특이사항",
}: SpecialNoteInputProps) {
  return (
    <div className="space-y-2">
      <label
        className="flex items-center gap-2 font-medium"
        style={{ color: "var(--text-main)", fontSize: "1rem" }}
      >
        <FileText className="h-5 w-5" style={{ color: "var(--text-muted)" }} />
        특이사항
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2"
        style={{
          backgroundColor: "var(--surface)",
          color: "var(--text-main)",
          borderColor: "var(--border)",
          fontSize: "1rem",
        }}
      />
    </div>
  );
}
