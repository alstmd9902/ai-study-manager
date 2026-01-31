import { useEffect, type ReactNode } from "react";

/** 라이트 모드만 사용. data-theme="light" 고정 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  return <>{children}</>;
}
