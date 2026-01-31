import { ChevronDown, Users } from "lucide-react";
import type { ChangeEvent } from "react";
import type { WeekRecord } from "../types";
import {
  getStudentPeriodAverage,
  getStudentPeriodNotes
} from "../utils/average";
import { getStoredWeekKeys, getWeekLabel } from "../utils/weekKey";
import { ExportButtons } from "./ExportButtons";

interface WeeklyStudentSummaryProps {
  weekKey: string;
  record: WeekRecord;

  selectedDayGroup: "monWedFri" | "tueThuSat";
  selectedPeriod: "period1" | "period2" | "period3";

  onWeekChange: (weekKey: string) => void;
  onRecordLoad: (weekKey: string) => void;
}

export function WeeklyStudentSummary({
  weekKey,
  record,
  selectedDayGroup,
  selectedPeriod,
  onWeekChange,
  onRecordLoad
}: WeeklyStudentSummaryProps) {
  const storedKeys = getStoredWeekKeys();
  const uniqueKeys = Array.from(new Set([weekKey, ...storedKeys]));
  const options = uniqueKeys.sort((a, b) => a.localeCompare(b));

  const periodRecord = record.schedule?.[selectedDayGroup]?.[selectedPeriod];

  const students =
    periodRecord?.homework
      ?.map((h) => h.name)
      .filter((name) => name && name.trim() !== "") ?? [];

  const handleWeekSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    onWeekChange(key);
    onRecordLoad(key);
  };

  return (
    <div
      className="space-y-4 rounded-xl p-5 shadow-sm"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)"
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center justify-between gap-3">
          <h3
            className="flex items-center gap-2 font-semibold"
            style={{ color: "var(--text-main)", fontSize: "1.125rem" }}
          >
            <Users className="h-5 w-5" style={{ color: "var(--text-muted)" }} />
            학생 주간 요약
          </h3>
          <ExportButtons
            weekKey={weekKey}
            summaryRows={students.map((name) => {
              const avg = getStudentPeriodAverage(
                record,
                selectedDayGroup,
                selectedPeriod,
                name
              );
              const { reasonBelow100, weeklyIssue } = getStudentPeriodNotes(
                record,
                selectedDayGroup,
                selectedPeriod,
                name
              );
              return {
                name,
                avg: avg ?? 0,
                reasonBelow100: reasonBelow100 || "-",
                weeklyIssue: weeklyIssue || "-",
                missedHomework: []
              };
            })}
          />
        </div>

        <label className="flex items-center gap-2">
          <span
            className="text-sm font-medium mr-3"
            style={{ color: "var(--text-muted)" }}
          >
            주차 선택
          </span>

          <div className="relative">
            <select
              value={weekKey}
              onChange={handleWeekSelect}
              className="appearance-none rounded-lg border px-3 py-2 pr-10 w-[120px]"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--text-main)",
                borderColor: "var(--border)",
                fontSize: "1rem"
              }}
            >
              {options.map((key) => (
                <option key={key} value={key}>
                  {getWeekLabel(key)}
                </option>
              ))}
            </select>

            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: "var(--text-muted)" }}
            />
          </div>
        </label>
      </div>

      {students.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
          이 주에 교시별 숙제에 입력한 학생이 없습니다.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]" style={{ fontSize: "1rem" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border)",
                  backgroundColor: "var(--surface-hover)"
                }}
              >
                <th className="px-3 py-2.5 text-left">학생 이름</th>
                <th className="px-3 py-2.5 text-left">숙제 평균</th>
                <th className="px-3 py-2.5 text-left">100% 미만 사유</th>
                <th className="px-3 py-2.5 text-left">이번 주 이슈</th>
                <th className="px-3 py-2.5 text-left">못한숙제</th>
              </tr>
            </thead>
            <tbody>
              {students.map((name) => {
                const { reasonBelow100, weeklyIssue, missedHomework } =
                  getStudentPeriodNotes(
                    record,
                    selectedDayGroup,
                    selectedPeriod,
                    name
                  );

                const avg = getStudentPeriodAverage(
                  record,
                  selectedDayGroup,
                  selectedPeriod,
                  name
                );

                return (
                  <tr key={name}>
                    <td className="px-3 py-2.5">{name}</td>
                    <td className="px-3 py-2.5">
                      {avg != null ? `${avg}%` : "-"}
                    </td>
                    <td className="px-3 py-2.5">
                      <textarea
                        value={reasonBelow100 ?? ""}
                        readOnly
                        rows={2}
                        className="w-full resize-none rounded border px-2.5 py-1.5"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <textarea
                        value={weeklyIssue ?? ""}
                        readOnly
                        rows={2}
                        className="w-full resize-none rounded border px-2.5 py-1.5"
                      />
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      {missedHomework && missedHomework.length > 0 ? (
                        <ul className="list-disc pl-4 space-y-1">
                          {missedHomework.map((text, i) => (
                            <li key={i}>{text}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400">없음</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
