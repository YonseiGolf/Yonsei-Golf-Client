# shadcn/ui 공통 컴포넌트 적용

| 항목 | 내용 |
| --- | --- |
| 구현일 | 2026-09-14 |
| 브랜치 | `migration/react-typescript-pnpm` |
| 범위 | 일반·관리자 화면의 공통 UI, 기존 색상·레이아웃 유지 |
| 제외 | 서버 수정, 실서버 쓰기·메일 발송, 배포·머지 |

## 배경

React 전환 후에도 대부분의 컨트롤은 기존 HTML/CSS를 사용했고, shadcn 방식의 Button과 직접 사용한 Radix Dialog만 있었습니다. 공통 UI의 스타일과 키보드 동작을 일관되게 만들기 위해 공식 shadcn/ui 소스를 도입했습니다.

`~/every-golf/admin`과 동일한 new-york 설정, TypeScript, Tailwind CSS 4, 개별 Radix 패키지, `cn`/`class-variance-authority` 방식을 따릅니다. shadcn은 프로젝트가 소스를 소유하는 방식으로 적용하며, 컴포넌트 코드는 `src/components/ui/`에 있습니다.

## 디자인 기준

- 네이비 `#08366f`, 흰 배경, 본문색 `#2c3e50`, 회색 면 `#f2f2f2`를 유지합니다.
- 기존 마케팅 제목의 GmarketSans, 공통 컨트롤의 Pretendard를 사용합니다.
- 페이지 순서, 기능별 폴더, 기존 URL, 관리자 목록의 분할 구조는 유지합니다.
- 입력 경계선·포커스·비활성 상태를 통일합니다. 주요 동작은 네이비, 취소·보조 동작은 outline, 삭제는 destructive를 사용합니다.
- 홈 활동 카드 크기와 카카오 로그인 버튼의 노란색은 명시적으로 보존합니다.
- 페이지를 새 디자인으로 재구성하지 않으며, 정적 소개 영역은 기존 CSS를 유지합니다.

## 적용 범위

| 공통 컴포넌트 | 적용 화면 |
| --- | --- |
| Button | 일반·관리자 동작 버튼, 관리자 내비게이션, 지원/게시글/템플릿 작성 링크, 에러 재시도 |
| Input / Label / Textarea | 회원가입, 지원서, 게시글·템플릿 작성/수정, 모집 일정·면접 시간 |
| Select | 회원 구분, 지원서 합격 상태, 기수 필터, 게시글 분류·템플릿 |
| Table | 회원·지원서·알림·게시판·템플릿 목록, 동아리 활동, 모집 일정·면접 시간 |
| Tabs | FAQ 분류, 게시판 분류 |
| Accordion | 기존 FAQ 9개 항목 |
| Checkbox | 지원서의 복수 면접 가능 시간 |
| AlertDialog | 제출·삭제·등급 변경·메일 발송 등 기존 확인 절차 |
| Dialog | 지원자 면접 시간 지정 |
| Sheet | 모바일 내비게이션 |
| Pagination | 게시판·회원·지원서 목록의 이전/다음 이동 |

공식 컴포넌트 파일은 총 13개입니다. 날짜·파일 입력은 브라우저의 기본 입력 기능을 유지한 shadcn Input이며, 별도 Calendar/파일 업로더로 바꾸지 않았습니다. 관리자 메뉴는 페이지 이동이므로 Tabs가 아닌 Button으로 구성한 링크를 사용합니다.

## 주요 구성

| 파일 | 역할 |
| --- | --- |
| `components.json` | shadcn 스타일, CSS 및 경로 별칭 설정 |
| `src/components/ui/` | 공식 레지스트리 기반 컴포넌트와 프로젝트별 조정 |
| `src/assets/theme.css` | 디자인 토큰, 제한적 초기 스타일, 모션 감소 설정 |
| `src/components/common/SelectField.tsx` | 도메인 값과 Select 옵션 연결, 빈 값·빈 목록 처리 |
| `src/components/common/ConfirmDialog.tsx` | 기존 Promise 기반 확인 흐름을 AlertDialog에 연결 |
| `src/components/qna/FaqList.tsx` | FAQ 내용과 Accordion 연결 |

### 스타일 충돌 방지

전역 Preflight는 적용하지 않습니다. 기존 화면 CSS는 `legacy` 레이어에 두고, shadcn 초기 스타일과 Tailwind 유틸리티가 그 뒤에 적용되도록 순서를 명시했습니다. 이 방식으로 기존 화면 구성은 유지하면서 컴포넌트의 variant·focus·disabled 스타일이 기존 태그 선택자에 의해 무효화되는 문제를 방지합니다.

기존 FAQ 체크박스 전용 CSS, 수동 모바일 사이드바 CSS 및 사용하지 않는 공통 모달·페이지네이션 스타일은 제거했습니다. 관리자 내비게이션의 목록 스타일은 해당 메뉴로 범위를 좁혀 페이지 내부의 Pagination까지 영향을 주지 않게 했습니다.

### 동작과 접근성

- Button의 기본 type은 `button`입니다. 저장·제출만 명시적으로 `submit`을 사용합니다.
- 링크는 `asChild`로 구성해 중첩 button/a를 만들지 않습니다.
- Select 옵션 선택 후 Enter의 기본 클릭이 새 확인창 버튼을 누르거나 폼을 제출하지 않도록 처리했습니다.
- Select의 빈 문자열 옵션을 내부 값으로 변환하고, 데이터가 없는 선택창은 비활성화합니다.
- FAQ 탭은 방향키·Home/End, 질문은 Enter/Space로 조작합니다. 탭 변경 후에도 열어 둔 답변을 유지합니다.
- Sheet는 포커스를 내부에 유지하고 Escape·페이지 이동·데스크톱 전환으로 닫힙니다.
- 확인창 취소와 면접 Dialog 닫기 후 원래 컨트롤로 포커스를 복원합니다.
- 면접 저장 중에는 닫기를 막습니다. 같은 조회 키의 재조회는 기존 데이터를 유지해 화면 재생성과 포커스 손실을 방지합니다. 다른 경로·필터로 바뀌면 이전 데이터는 표시하지 않습니다.
- `prefers-reduced-motion` 환경에서는 컴포넌트 전환 애니메이션을 최소화합니다.

## 검증

다음 명령으로 재현할 수 있습니다.

```sh
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:e2e
pnpm build
```

검증 범위는 기존 기능 회귀와 새 공통 UI 동작입니다. 일반·관리자 15개 경로를 320/390/768/1440px에서 검사하며, 브라우저 테스트는 가짜 API를 사용합니다. 실제 카카오 로그인·스토리지·메일 발송을 검증한 것은 아닙니다.

검증 결과와 외부 연동의 제한은 [마이그레이션 문서](react-migration.md)에 함께 기록합니다. 화면 캡처는 실행 후 `test-results/`에서 확인할 수 있습니다.

2026-09-14 최종 검증: Biome·TypeScript·프로덕션 빌드 통과, Vitest 32개·Playwright 24개 통과. 추가 확인에서 발견한 Enter의 확인창 오작동과 재조회 후 포커스 손실을 수정하고 회귀 테스트에 포함했습니다.

## 유지보수와 남은 제한

- 새 컨트롤은 기능 폴더에서 직접 스타일을 다시 만들기보다 `ui/`를 사용합니다.
- 공식 컴포넌트를 업데이트할 때는 로컬의 한국어 레이블·안전한 버튼 type·Enter 처리·레이어/z-index 조정을 보존하고 회귀 테스트를 실행합니다.
- 외부 MinIO 이미지의 연결 문제는 이번 UI 작업으로 해결하지 않았습니다. 모바일 로고는 헤더와 같은 기존 MinIO 주소로 통일했습니다.
- 모든 화면이 기존 Vue 버전과 픽셀 단위로 동일하다는 의미는 아닙니다. 공통 컨트롤의 테두리·간격·상태 표현은 의도적으로 개선했습니다.
- 서버 요청/응답 계약과 기존 권한 규칙은 변경하지 않았습니다.

## 출처

- [shadcn/ui Vite 설정](https://ui.shadcn.com/docs/installation/vite)
- [Button](https://ui.shadcn.com/docs/components/radix/button), [Select](https://ui.shadcn.com/docs/components/radix/select)
- 공식 레지스트리: `https://ui.shadcn.com/r/styles/new-york-v4/<name>.json` (2026-09-14 조회)
- 원본 라이선스 및 변경 고지: [THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md)
