# 수업 관리 웹앱

1인 사용 전용 수업 기록·학생 숙제(단어점수)·주간 평균 관리 웹앱입니다.

## 기능

- **주차 관리**: 날짜/Date Picker로 주차 선택, 주차별 데이터 로드·삭제
- **요일/교시**: 월수금·화목토 / 1·2·3교시 탭
- **교시별 입력**: 특이사항(결석·보충·기타), 진도 체크(리딩·리스닝·문법), 숙제(단어 점수)
- **학생 주간 요약**: 숙제 평균(100% 기준), 100% 미만 사유, 이번 주 이슈
- **평균 계산**: 해당 주차 모든 교시에서 점수 입력된 것만 포함, 소수점 1자리 반올림
- **출력**: Excel(수업기록·학생요약 시트), PDF 다운로드
- **저장**: LocalStorage (`weekly-records`), 새로고침 시 유지

## 기술 스택

- React 19 + Vite + TypeScript
- Tailwind CSS 4, Lucide React
- xlsx (Excel), jsPDF (PDF)
- 배포: Vercel

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

## 빌드·배포

```bash
npm run build
npm run preview   # 로컬 프리뷰
```

Vercel 배포: 저장소 연결 후 `dist` 출력, Vite 프로젝트로 자동 인식됩니다.

## 학생 목록

기본 학생: 박서아, 김다온, 김하영. `src/types.ts`의 `DEFAULT_STUDENTS`에서 변경 가능합니다.
