import { FileSpreadsheet } from "lucide-react";
import { exportToExcel } from "../utils/exportExcel";

interface StudentWeeklySummaryRow {
  name: string;
  avg: number;
  reasonBelow100: string;
  weeklyIssue: string;
}

interface ExportButtonsProps {
  weekKey: string;
  summaryRows: StudentWeeklySummaryRow[];
}

export function ExportButtons({ weekKey, summaryRows }: ExportButtonsProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => {
          console.log("엑셀 summaryRows:", summaryRows);
          exportToExcel(weekKey, summaryRows);
        }}
        className="flex items-center gap-1 rounded bg-green-600 px-3 py-1.5 text-white"
      >
        <FileSpreadsheet size={16} />
        엑셀 다운로드
      </button>
    </div>
  );
}
