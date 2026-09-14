# Yonsei Golf Client

연세대학교 골프동아리 웹사이트입니다. 기존 Vue 프로젝트의 기능별 폴더와 URL을 유지하면서 pnpm · React · TypeScript로 전환했습니다.

페이지별 작업 내용, 서버 계약과 검증 결과는 [마이그레이션 문서](docs/features/react-migration.md)를 확인하세요.

shadcn 공통 컴포넌트의 적용 범위와 디자인 기준은 [UI 개선 문서](docs/features/shadcn-ui.md)에 정리했습니다.

## 기술 스택

`~/every-golf/admin`을 기준으로 React 19, TypeScript 6, Vite 8, React Router 7, Zustand 5, Tailwind CSS 4, shadcn/ui(Radix 기반), Biome, Vitest, Playwright를 사용합니다. HTTP 요청은 공통 fetch 클라이언트를 사용합니다.

## 실행

Node.js 22.12 이상과 pnpm 10.33.2가 필요합니다.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

개발 주소는 `http://localhost:3000`입니다. 서버의 기존 CORS 허용 포트에 맞췄습니다. `pnpm serve`도 같은 개발 서버를 실행합니다.

새 환경에서는 `.env.example`을 참고해 `.env`를 작성합니다. 기존 `.env`가 있다면 덮어쓰지 않아도 됩니다.

| 환경변수 | 용도 | 호환되는 기존 이름 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | API 서버 주소 | `VUE_APP_API_URL` |
| `VITE_KAKAO_REST_API_KEY` | 카카오 REST API 키 | `VUE_APP_KAKAO_REST_API_KEY` |
| `VITE_KAKAO_REDIRECT_URI` | 카카오 콜백 주소 | `VUE_APP_KAKAO_REDIRECT_URI` |

새 변수 값이 우선합니다. 이전 이름 세 개만 Vite 설정에서 명시적으로 변환하며 다른 환경변수를 브라우저에 노출하지 않습니다. 환경변수는 빌드 시 반영되므로 변경 후 재빌드가 필요합니다.

카카오 Redirect URI는 서버에서 토큰 교환에 사용하는 주소 및 카카오 콘솔 등록값과 일치해야 합니다. 서버는 `../Yonsei-Golf-Server`에 있습니다.

## 구조

```text
src/
  components/
    home/ common/ applyinfo/ qna/
    user/ application/ board/ admin/ ui/
  router/index.tsx
  store.ts
  hooks/          # 조회 취소·재시도, 중복 실행 방지
  lib/            # fetch, 환경설정, JWT, 형식 변환
  types/api.ts    # 서버 요청/응답 타입
  assets/
  App.tsx
  main.tsx
tests/            # 단위 테스트
e2e/              # 가짜 API를 이용한 브라우저 테스트
docs/features/
```

화면은 기존 위치의 `.tsx`와 컴포넌트 범위를 가진 `.css`로 구성했습니다. `components.json`과 `src/components/ui/`에 shadcn 설정·소스를 두고 공통 컨트롤을 사용합니다. 기존 CSS는 `legacy` 레이어, 네이비 테마는 `src/assets/theme.css`에서 관리하며, 전역 Tailwind Preflight는 적용하지 않습니다.

## 검증

```sh
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm exec playwright install chromium
pnpm test:e2e
pnpm build
```

E2E는 `localhost:4173`의 별도 서버와 가짜 API를 사용합니다. 실제 카카오 로그인, 지원서 제출, 이메일 발송은 실행하지 않습니다. `test-results/`에 화면 캡처 및 실패 시 추적 파일을 저장합니다.

`.github/workflows/check.yml`은 PR 및 수동 실행에서 위 검사를 수행합니다. 기존 `fe-deploy.yml`의 dev push 배포 조건은 유지했습니다.

## 빌드와 Docker

```sh
pnpm build
pnpm preview
docker build -t yonsei-golf-client:local .
docker run --rm -p 8100:80 yonsei-golf-client:local
```

Docker는 Node 22에서 pnpm으로 빌드하고 Nginx가 `dist/`를 제공합니다. URL 직접 접근과 새로고침은 기존 SPA fallback을 사용합니다.

## 통합 확인 항목

- 서버가 모집 날짜와 배정된 면접 시간을 연도 없이 반환하므로, 기존 일정 수정 시 연도를 포함한 날짜를 다시 선택해야 합니다.
- 결과 메일 및 모집 시작 메일은 전체 기수의 해당 미발송자를 대상으로 합니다. 화면과 확인창에 발송 범위를 표시합니다.
- 원본 MinIO 이미지 URL을 유지했습니다. 모바일 로고도 헤더와 같은 주소를 사용합니다. 해당 이미지 서버 연결 문제로 저장소 복구 후 실화면 확인이 필요합니다.
- 실제 카카오 로그인·쿠키 갱신·스토리지 PUT의 환경별 CORS 동작은 연결 가능한 개발 서버에서 확인해야 합니다.
