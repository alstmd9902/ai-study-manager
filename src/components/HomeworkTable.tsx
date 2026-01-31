import { ClipboardList, Plus, Trash2 } from "lucide-react";
import { Fragment } from "react";
import type { HomeworkEntry } from "../types";

interface HomeworkTableProps {
  homework: HomeworkEntry[];
  onChange: (homework: HomeworkEntry[]) => void;
  period: 1 | 2 | 3;
}

export function HomeworkTable({
  homework,
  onChange,
  period
}: HomeworkTableProps) {
  const PERIOD_BADGE_COLOR: Record<1 | 2 | 3, string> = {
    1: "#0551f6", // 파랑
    2: "#29b829", // 초록
    3: "#c143aa" // 분홍
  };
  // period를 1|2|3 숫자로 정규화
  const normalizePeriod = (p: unknown): 1 | 2 | 3 => {
    if (p === 1 || p === "1" || p === "1교시") return 1;
    if (p === 2 || p === "2" || p === "2교시") return 2;
    if (p === 3 || p === "3" || p === "3교시") return 3;
    return 1; // fallback
  };
  // Normalize to use reason string for all entries
  const entries: HomeworkEntry[] =
    homework.length > 0
      ? homework.map((e) => ({
          ...e,
          issue: typeof e.issue === "string" ? e.issue : "",
          reason: typeof e.reason === "string" ? e.reason : "",
          missedTodos: Array.isArray(e.missedTodos) ? e.missedTodos : [],
          _newTodo: typeof e._newTodo === "string" ? e._newTodo : ""
        }))
      : [
          {
            name: "",
            wordScore: null,
            homeworkScore: null,
            reason: "",
            issue: "",
            missedTodos: [],
            _newTodo: ""
          }
        ];

  const handleNameChange = (index: number, name: string) => {
    const next = entries.map((e, i) => (i === index ? { ...e, name } : e));
    onChange(next);
  };

  // Handles 숙제 점수
  const handleHomeworkScoreChange = (index: number, value: string) => {
    const next = entries.map((e, i) => {
      if (i !== index) return e;
      if (value === "" || value === "결석")
        return { ...e, homeworkScore: null };
      const num = parseInt(value, 10);
      const homeworkScore = Number.isNaN(num)
        ? null
        : Math.min(100, Math.max(0, num));
      return { ...e, homeworkScore };
    });
    onChange(next);
  };

  const handleIssueChange = (index: number, value: string) => {
    const next = entries.map((e, i) =>
      i === index ? { ...e, issue: value } : e
    );
    onChange(next);
  };

  const handleAddRow = () => {
    onChange([
      ...entries,
      {
        name: "",
        wordScore: null,
        homeworkScore: null,
        reason: "",
        issue: "",
        missedTodos: [],
        _newTodo: ""
      }
    ]);
  };

  const handleRemoveRow = (index: number) => {
    if (entries.length <= 1) return;
    const next = entries.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <label
        className="flex items-center gap-2 font-medium"
        style={{ color: "var(--text-main)", fontSize: "1rem" }}
      >
        <ClipboardList
          className="h-5 w-5"
          style={{ color: "var(--text-muted)" }}
        />
        숙제
      </label>
      <div
        className="overflow-x-auto rounded-lg border w-full"
        style={{ borderColor: "var(--border)" }}
      >
        <table className="w-full" style={{ fontSize: "1rem" }}>
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border)",
                backgroundColor: "var(--surface-hover)"
              }}
            >
              <th
                className="px-2 py-2 text-left font-medium"
                style={{ color: "var(--text-main)" }}
              >
                학생 이름
              </th>
              <th
                className="px-2 py-2 text-left font-medium"
                style={{ color: "var(--text-main)" }}
              >
                단어
              </th>
              <th
                className="px-2 py-2 text-left font-medium"
                style={{ color: "var(--text-main)" }}
              >
                숙제
              </th>
              <th
                className="px-3 py-2.5 text-left font-medium"
                style={{ color: "var(--text-main)" }}
              >
                100% 미만 사유
              </th>
              <th
                className="px-3 py-2.5 text-left font-medium"
                style={{ color: "var(--text-main)" }}
              >
                이번 주 이슈
              </th>
              <th className="w-10 px-2 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <Fragment key={index}>
                <tr key={index} style={{ verticalAlign: "top" }}>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={entry.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      placeholder="입력"
                      className="inline-block w-[90px] rounded-lg px-4 py-1 font-semibold focus:outline-none"
                      style={{
                        backgroundColor:
                          PERIOD_BADGE_COLOR[normalizePeriod(period)],
                        color: "#ffffff",
                        fontSize: "1rem",
                        border: "none"
                      }}
                    />
                  </td>

                  {/* 단어점수 적는란 */}
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      value={entry.wordScore ?? ""}
                      onChange={(e) => {
                        const next = entries.map((en, i) =>
                          i === index
                            ? {
                                ...en,
                                wordScore: e.target.value
                              }
                            : en
                        );
                        onChange(next);
                      }}
                      placeholder="입력란"
                      className="w-16 text-center rounded border px-2.5 py-1"
                      style={{
                        backgroundColor: "var(--surface)",
                        color: "var(--text-main)",
                        borderColor: "var(--border)",
                        fontSize: "1rem"
                      }}
                    />
                  </td>

                  <td className="px-2 py-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={
                        entry.homeworkScore != null
                          ? String(entry.homeworkScore)
                          : ""
                      }
                      onChange={(e) =>
                        handleHomeworkScoreChange(index, e.target.value)
                      }
                      placeholder="숫자"
                      className="w-12 rounded border px-2.5 py-1"
                      style={{
                        backgroundColor: "var(--surface)",
                        color:
                          typeof entry.homeworkScore === "number" &&
                          entry.homeworkScore < 100
                            ? "red"
                            : "var(--text-main)",
                        borderColor: "var(--border)",
                        fontSize: "1rem"
                      }}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <textarea
                      value={entry.reason ?? ""}
                      onChange={(e) => {
                        const next = entries.map((en, i) =>
                          i === index ? { ...en, reason: e.target.value } : en
                        );
                        onChange(next);
                      }}
                      placeholder="사유 입력"
                      className="w-full min-w-[160px] resize-none rounded border px-2.5 py-1.5"
                      rows={2}
                      style={{
                        backgroundColor: "var(--surface)",
                        color: "var(--text-main)",
                        borderColor: "var(--border)",
                        fontSize: "1rem"
                      }}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <textarea
                      value={entry.issue}
                      onChange={(e) => handleIssueChange(index, e.target.value)}
                      placeholder=""
                      className="w-full min-w-[160px] resize-none rounded border px-2.5 py-1.5"
                      style={{
                        backgroundColor: "var(--surface)",
                        color: "var(--text-main)",
                        borderColor: "var(--border)",
                        fontSize: "1rem"
                      }}
                      rows={2}
                    />
                  </td>
                  <td className="px-2 py-2.5">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                      className="rounded p-1.5 transition-colors hover:opacity-80"
                      style={{ color: "var(--text-muted)" }}
                      aria-label="행 삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border)"
                  }}
                >
                  <td colSpan={6} className="px-3 pb-2">
                    <div
                      className="rounded-md border p-2 space-y-1"
                      style={{
                        borderColor: "var(--border)",
                        backgroundColor: "var(--surface-hover)"
                      }}
                    >
                      <div className="font-medium text-sm">못한 숙제</div>
                      {/* 입력 + 추가 */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={entry._newTodo ?? ""}
                          onChange={(e) => {
                            const next = entries.map((en, i) =>
                              i === index
                                ? { ...en, _newTodo: e.target.value }
                                : en
                            );
                            onChange(next);
                          }}
                          placeholder="못한 숙제 입력"
                          className="w-[300px] rounded border px-2 py-1 text-sm"
                          style={{ borderColor: "var(--border)" }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const text = (entry._newTodo ?? "").trim();
                            if (!text) return;
                            const next = entries.map((en, i) => {
                              if (i !== index) return en;
                              return {
                                ...en,
                                missedTodos: [
                                  ...(en.missedTodos ?? []),
                                  { text, done: false }
                                ],
                                _newTodo: ""
                              };
                            });
                            onChange(next);
                          }}
                          className="rounded border px-2 py-1 text-sm"
                        >
                          추가
                        </button>
                        {/* 전체 삭제 */}
                        <button
                          type="button"
                          onClick={() => {
                            const next = entries.map((en, i) =>
                              i === index ? { ...en, missedTodos: [] } : en
                            );
                            onChange(next);
                          }}
                          className="text-xs text-red-500"
                        >
                          전체 삭제
                        </button>
                      </div>
                      {/* 리스트 */}
                      <ul className="space-y-0.5">
                        {(entry.missedTodos ?? []).map((todo, tIndex) => (
                          <li
                            key={`${index}-todo-${tIndex}`}
                            className="group flex items-start gap-2 text-sm"
                          >
                            <label className="flex items-cneter gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={todo.done}
                                onChange={() => {
                                  const next = entries.map((en, i) => {
                                    if (i !== index) return en;
                                    const list = (en.missedTodos ?? []).map(
                                      (t, j) =>
                                        j === tIndex
                                          ? { ...t, done: !t.done }
                                          : t
                                    );
                                    return { ...en, missedTodos: list };
                                  });
                                  onChange(next);
                                }}
                              />
                              <span
                                style={{
                                  textDecoration: todo.done
                                    ? "line-through"
                                    : "none",
                                  opacity: todo.done ? 0.5 : 1
                                }}
                              >
                                {todo.text}
                              </span>
                            </label>
                            {/* 개별 삭제 (hover) */}
                            <button
                              type="button"
                              onClick={() => {
                                const next = entries.map((en, i) => {
                                  if (i !== index) return en;
                                  const list = (en.missedTodos ?? []).filter(
                                    (_, j) => j !== tIndex
                                  );
                                  return { ...en, missedTodos: list };
                                });
                                onChange(next);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-xs text-red-500 ml-2"
                            >
                              삭제
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={handleAddRow}
        className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium"
        style={{
          backgroundColor: "var(--surface)",
          color: "var(--text-main)",
          borderColor: "var(--border)"
        }}
      >
        <Plus className="h-4 w-4" />행 추가
      </button>
    </div>
  );
}
