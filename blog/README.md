# 상훈의 기록

Next.js, Tiptap, Supabase로 만든 개인 블로그입니다. 방문자는 발행된 글을
읽을 수 있고, 등록된 관리자만 글과 카테고리, 첨부 파일을 관리할 수 있습니다.

## 주요 기능

- 카테고리, 제목, 본문, 태그 기반 글 관리
- Tiptap 리치 텍스트 에디터
- Supabase Auth 기반 단일 관리자 로그인
- Supabase Database RLS와 Storage 업로드 정책
- 반응형 공개 블로그와 관리자 화면
- 동적 Metadata, Open Graph, JSON-LD, sitemap, robots, RSS

## Project structure

```text
app/                    # Next.js App Router entry points
src/
├── _app/               # Application-wide providers and styles
├── _pages/             # Route-level page slices
└── shared/             # Reusable UI, libraries, and API clients
```

Add `features` and `entities` only when a reusable interaction or domain
boundary is established. The root `app` directory should remain a thin routing
layer that delegates rendering to `src/_pages`.

## 시작하기

`.env.example`을 참고해 `.env.local`을 설정합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Supabase 프로젝트를 연결하고 migration을 반영합니다.

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Supabase Auth에서 `dam2gik@gmail.com` 사용자를 생성해야 관리자 로그인이
가능합니다. 관리자 이메일을 바꾸려면
`supabase/migrations/20260930021211_create_blog_schema.sql`의
`private.blog_admins` 초기값을 배포 전에 변경합니다.

```bash
npm install
npm run dev
```

공개 블로그는 `/`, 관리자는 `/admin`에서 접근합니다.

## 검증

```bash
npm run typecheck
npm run lint
npm run build
npx supabase db reset --local --no-seed
npx supabase db lint --local --level warning --fail-on error
```

RLS 검증 SQL은 `supabase/tests/blog_rls.sql`에 있습니다.

## shadcn 컴포넌트 추가

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

컴포넌트는 `src/shared/ui`에 생성됩니다.

## 컴포넌트 사용

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/shared/ui/button";
```
