# Vue → React 마이그레이션

## 목적과 범위

- 기존 `src/components/{home,common,applyinfo,qna,user,application,board,admin}` 구분, 공개 URL, 한국어 콘텐츠와 화면 구성을 유지한다.
- `~/every-golf/admin`의 pnpm 10, React 19, TypeScript 6, Vite 8, React Router 7, Zustand 5, Tailwind 4, Radix/shadcn 방식, Biome, Vitest, Playwright를 따른다.
- 서버 계약은 `../Yonsei-Golf-Server/src/main/java/yonseigolf/server`의 Controller·DTO를 기준으로 한다. 서버 코드는 수정하지 않는다.
- 작업 브랜치: `migration/react-typescript-pnpm`. 머지·배포는 하지 않는다.

## 페이지별 순서와 완료 기준

| 순서 | URL / 영역 | 전환 내용 | 검증 기준 | 상태 |
| --- | --- | --- | --- | --- |
| 0 | 공통 기반 | pnpm/Vite/TS, 라우터, Zustand 인증, fetch API, 환경변수, 공통 알림·폼·페이지네이션 | 타입 검사·빌드, 토큰 갱신/권한 테스트 | 구현 완료 |
| 1 | `/` | MainInfo, ClubIntroduction, ClubActivityIntroduction, ContactInfo | 기존 콘텐츠·이미지·모바일 캐러셀·내비게이션 | 구현 완료 |
| 2 | `/recruit` | ApplyQualification, ApplyPeriod, QnA 및 3개 탭 | 모집 일정 조회, FAQ 펼치기, 탭 전환 | 구현 완료 |
| 3 | `/login`, `/oauth/kakao`, `/signup` | 카카오 인가 → 임시 토큰 → 로그인/가입, 폼 검증 | 신규/기존 회원, 실패·새로고침·로그아웃 | 구현 완료 |
| 4 | `/apply`, `/apply/form`, `/admin/apply/form` | 지원 가능 여부, 알림 등록, 개인정보·서술 문항·동아리·사진·면접 시간 | 필수값, presigned PUT, 서버 제출 필드, 중복 제출 방지 | 구현 완료 |
| 5 | `/board`, `/board/post`, `/board/:boardId` | 목록·분류·페이지, 작성·수정·삭제·댓글 | 서버 enum, 작성자/관리자 권한, 페이지 이동 | 구현 완료 |
| 6 | `/admin`, `/admin/users` | 관리자 레이아웃, 사용자 분류·등급 변경 | 전체 관리자 경로 보호, 필터·페이지 초기화 | 구현 완료 |
| 7 | `/admin/form`, `/application/:id` | 기수/합격 여부 필터, 지원서 상세·합격/면접 지정, 결과 메일 | 필터 파라미터, 선택값, 발송 전 확인 | 구현 완료 |
| 8 | `/admin/apply-alarm` | 기수별 모집 알림 목록·메일 발송 | 목록과 발송 범위 안내·확인 | 구현 완료 |
| 9 | `/admin/board/template`, `/admin/board/template/post`, `/admin/board/template/:templateId` | 템플릿 목록·생성·상세·수정·삭제 | `contents` 필드, 정적 post 경로 우선 매칭 | 구현 완료 |
| 10 | `/admin/apply-period` | 모집 기수·날짜 CRUD, 면접 시간 CRUD | 날짜와 ID 형식, 삭제 확인, 저장 후 재조회 | 구현 완료 |
| 11 | 배포 설정·회귀 검사 | Docker/CI pnpm·Node 변경, Vue 설정 정리, README | lint·typecheck·unit·e2e·production build | 구현 완료 |
| 12 | shadcn 공통 UI | 공식 컴포넌트 13종, 일반·관리자 화면 적용, 기존 테마 유지 | 키보드·포커스·확인창·반응형 회귀 | 구현 완료 |

shadcn 적용 범위와 유지보수 기준은 [UI 개선 문서](shadcn-ui.md)에 정리했습니다.

## 구현 원칙

- 화면별 `.vue`를 같은 위치의 `.tsx`로 옮긴다. Vue scoped 스타일은 화면별 CSS 범위와 `legacy` 레이어로 옮긴다. 공통 컨트롤은 shadcn/ui와 네이비 테마를 사용한다.
- 공통 통신·환경설정은 `src/lib`, 서버 요청/응답은 `src/types`, 재사용 비동기 상태는 `src/hooks`에 둔다. 기능별 API는 해당 컴포넌트 폴더에 둔다.
- 인증은 사용자 JWT와 가입 전 카카오 임시 JWT를 구분한다. 새로고침 후 서버 확인이 끝나기 전에 관리자 접근 여부를 판정하지 않는다.
- 지원 가능 여부는 클라이언트 날짜 계산 대신 서버 `/application/availability`를 사용한다.
- 지원서 사진은 서버의 최신 `/apply/forms/image/presigned-url` → 스토리지 PUT → `photoKey` 제출 계약을 사용한다. 기존 presigned 업로드의 파일 형식·10MB 제한·미리보기 URL 해제 동작을 유지한다.
- 서버 오류를 화면에 표시하고 재시도를 제공한다. 메일·삭제·권한 변경 동작은 UI 확인 절차를 유지하며, 검증에서는 API를 모킹한다.

## 환경과 주의점

- 개발 서버는 기존 서버 CORS 허용 목록에 맞춰 `http://localhost:3000`을 사용한다. 테스트는 별도 포트에서 가짜 API를 사용한다.
- `VUE_APP_API_URL`, `VUE_APP_KAKAO_REST_API_KEY`, `VUE_APP_KAKAO_REDIRECT_URI`는 대응하는 `VITE_*`로 이관한다. 기존 로컬/CI 환경은 전환 기간의 제한적 alias로 호환한다.
- 카카오 Redirect URI는 서버가 토큰 교환에 사용하는 URI와 같아야 한다. 로컬 실제 로그인은 카카오/서버 설정이 일치하는 개발 환경에서 검증한다.
- 실서버 쓰기, 실제 이메일 발송, Docker 이미지 push, git merge는 실행하지 않는다.

## 검증 기록

2026-09-14 기준 검증 결과입니다. 외부 API는 가짜 응답으로 대체한 클라이언트 검증이며, 실서비스 통합 완료를 의미하지 않습니다.

| 검사 | 결과 |
| --- | --- |
| Biome lint | 통과 |
| TypeScript strict / production build | 통과 |
| Vitest | 32개 통과 |
| Playwright | 24개 통과 |
| 화면 크기 | 320px / 390px / 768px / 1440px, 각 15개 경로의 가로 넘침 검사 |
| Docker | Node 22 Alpine의 새 의존성 설치·production build, Nginx 설정 검사 및 `/admin/apply-period` 직접 접근의 SPA fallback 통과 |
| Git | 머지·커밋·push 없음. 서버 저장소 변경 없음 |

단위 테스트는 UTF-8/base64url JWT, 신규 가입 임시 토큰, 동시 토큰 갱신, 실패 후 무한 재시도 방지, 로그아웃 도중 갱신 응답, 업로드 실패/파일 검증, nullable 합격 상태, 조회 응답 순서 역전, 중복 제출을 확인합니다.

브라우저 테스트는 공개 화면/FAQ/모바일 메뉴, 카카오 분기와 새로고침, 모든 관리자 경로 보호, 사진 업로드와 지원서 제출 성공·실패, 게시판 필터/작성/수정/댓글/삭제, 사용자 등급 변경, 지원서 합격/면접 변경, 템플릿 생성·수정, 메일 확인창 취소, 모집 기간 수정·면접 시간 추가를 확인합니다.

shadcn 전환 후에는 기본 버튼의 폼 오제출 방지, 빈 Select 값, FAQ 키보드 조작, Sheet 포커스 제한, Select → AlertDialog 키 입력 분리, 취소/저장 후 포커스 복원, 저장 중 Dialog 닫기 방지, 홈 활동 카드 크기와 카카오 버튼 색상도 검사합니다.

## 서버 계약에 맞춘 처리와 변경점

| 항목 | 확인한 서버 동작 | 클라이언트 처리 |
| --- | --- | --- |
| `Category` | `NOTICE`, `FREE`만 존재 | 지원되지 않는 `EVENT` 선택 제거 |
| `RecruitPeriodResponse` | `MM월dd일`, 연도 없음 | 원본 월·일 표시, ISO 날짜를 명시적으로 입력해야 수정 가능, 임의 연도 복원 없음 |
| `ApplicationResponse.interviewTime` | `MM월dd일 HH:mm` | 기존 배정 시간을 표시하고 변경 시 연도를 포함한 일시 입력 |
| `InterviewTimeResponse` | `yyyy-MM-dd HH:mm` | 입력은 datetime-local, 요청은 `yyyy-MM-ddTHH:mm:ss` |
| `UpdatePassRequest` | 두 필드 모두 Boolean nullable | 보류·서류 합격·최종 합격·탈락의 null/true/false 보존 |
| 지원서 목록 필터 | 생략한 합격 필드는 IS NULL 조건 | 접수/1차 합격/최종 합격/탈락별 기존 분리 조회 유지 |
| `/admin/forms/results` | 기수 필터 없음, 해당 결과의 미발송 지원자 전체 | 전체 기수 발송임을 버튼·본문·확인창에 명시 |
| `/admin/email/apply-start-email` POST | 기수 필터 없음, sentAt이 null인 전체 대기자 | 목록 기수와 발송 범위가 다름을 명시 |
| 지원서 실패 | HTTP 오류 가능 | 성공 안내/홈 이동 대신 입력 유지·오류 표시 |
| 게시글·댓글·지원서 본문 | 일반 문자열 | React 텍스트와 pre-wrap으로 줄바꿈 표시 |
| 관리자 지원서 양식 | 미리보기 목적 | 입력·로컬 미리보기 가능, 실제 제출·확인 메일 발송 비활성화 |

`src/views/HomeView.vue`, `AboutView.vue`, `PhotoTemplateHome.vue`는 라우터에서 사용하지 않던 초기 예제/빈 화면이어서 제거했습니다. 나머지 화면은 같은 기능 폴더로 이관했습니다. Vue CLI/Babel/JS 설정과 `yarn.lock`은 Vite/TypeScript/pnpm 설정으로 대체했습니다. 기존 소스는 원래 dev 브랜치와 Git 이력에 남아 있습니다.

## 통합 검증이 남은 항목

1. 실제 카카오 인가 → 서버 코드 교환 → 로그인/가입 → 쿠키 갱신. 개발 서버와 카카오 Redirect URI·쿠키 정책이 일치하는 환경에서 확인합니다.
2. 실제 스토리지 presigned PUT 및 브라우저 CORS. 자동 검증은 업로드 URL 발급과 PUT을 가짜 응답으로 확인했습니다.
3. 기존 외부 이미지. `minio.up-api.kr`의 로고·홈 이미지 HEAD 요청은 15초 내 연결되지 않았고, 이전 S3 사이드바 로고는 404였습니다. 현재 모바일 로고는 헤더와 같은 기존 MinIO 주소를 사용합니다. 이미지 서버 문제는 남아 있어 레이아웃 캡처에서는 외부 이미지가 비어 있을 수 있습니다.
4. 서버에서 관리자 날짜 응답을 ISO 형식으로 제공하면 재입력 없는 수정이 가능합니다. 서버 수정은 이번 범위에 포함하지 않았습니다.
5. 운영 데이터로 목록·권한·메일 수신 여부 확인은 수행하지 않았습니다. 자동 테스트 중 실제 이메일은 발송하지 않았습니다.

## 참고

- [Vite 시작 가이드](https://vite.dev/guide/) — Node 요구 버전 및 루트 HTML 진입점
- [React Router 선언형 라우팅](https://reactrouter.com/start/declarative/routing)
- [Tailwind CSS의 Vite 연동](https://tailwindcss.com/docs/installation/using-vite)
- 로컬 기준: `~/every-golf/admin/package.json`, `vite.config.ts`, `tsconfig.json`, `biome.json`
- 서버 기준: `UserController`, `BoardController`, `ApplicationController`, `EmailController`, 관련 DTO·Interceptor·Service·Repository
