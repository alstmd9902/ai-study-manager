import * as XLSX from "xlsx";
import { getWeekLabel } from "./weekKey";

interface StudentWeeklySummaryRow {
  name: string;
  avg: number;
  reasonBelow100: string;
  weeklyIssue: string;
}

export function exportToExcel(
  weekKey: string,
  summaryRows: StudentWeeklySummaryRow[]
) {
  const label = getWeekLabel(weekKey);

  const rows =
    summaryRows.length > 0
      ? summaryRows
      : [
          {
            name: "데이터 없음",
            avg: 0,
            reasonBelow100: "-",
            weeklyIssue: "-"
          }
        ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(
    rows.map((r) => ({
      "학생 이름": r.name,
      "숙제 평균(%)": r.avg,
      "100% 미만 사유": r.reasonBelow100,
      "이번 주 이슈": r.weeklyIssue
    }))
  );

  XLSX.utils.book_append_sheet(wb, ws, "학생주간요약");

  const filename = `${label.replace(/\s/g, "_")}_학생주간요약.xlsx`;

  XLSX.writeFile(wb, filename);
}
