import jsPDF from "jspdf";
import type { WeekRecord } from "../types";
import { getStudentWeeklyAverage } from "./average";
import { getUniqueStudentNamesFromWeek } from "./students";
import { getWeekLabel } from "./weekKey";

/** 학생 주간 요약만 PDF 출력 */
export function exportToPdf(weekKey: string, record: WeekRecord): void {
  const label = getWeekLabel(weekKey);
  const students = getUniqueStudentNamesFromWeek(record);
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let y = 18;
  const lineH = 6;
  const margin = 18;

  doc.setFontSize(16);
  doc.text(`${label} 학생 주간 요약`, margin, y);
  y += lineH * 2;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("학생 이름", margin, y);
  doc.text("숙제 평균(%)", margin + 45, y);
  doc.text("100% 미만 사유", margin + 85, y);
  doc.text("이번 주 이슈", margin + 135, y);
  y += lineH;
  doc.setFont("helvetica", "normal");

  const summary = record.studentSummary ?? {};
  for (const name of students) {
    const avg = getStudentWeeklyAverage(record, name);
    const entry = summary[name] ?? {};
    const avgStr = avg != null ? `${avg}%` : "-";
    const reason = (entry.reasonBelow100 ?? "").slice(0, 25);
    const issue = (entry.weeklyIssue ?? "").slice(0, 25);
    doc.text(name, margin, y);
    doc.text(avgStr, margin + 45, y);
    doc.text(reason, margin + 85, y);
    doc.text(issue, margin + 135, y);
    y += lineH;
    if (y > 270) {
      doc.addPage();
      y = 18;
    }
  }

  const filename = `${label.replace(/\s/g, "_")}_학생주간요약.pdf`;
  doc.save(filename);
}
