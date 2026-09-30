# AGENTS.md

## 기본 원칙

- 코드는 최대한 단순하고 읽기 쉽게 작성한다.
- 기존 구조와 패턴을 먼저 확인하고, 불필요하게 새로운 구조를 만들지 않는다.
- 하나의 컴포넌트나 파일이 너무 많은 책임을 가지지 않도록 적절히 분리한다.
- UI, 비즈니스 로직, 데이터 접근 로직은 가능한 한 분리한다.
- 이미 있는 컴포넌트나 유틸을 재사용할 수 있으면 새로 만들지 않는다.
- 파일 수정 시 기존 인코딩을 유지한다.
- 새 파일 생성 시 시스템 기본 인코딩을 사용한다.
- 작업 범위와 관계없는 코드까지 임의로 리팩토링하지 않는다.

---

## Skills

작업하기 전에 `.agents/skills`에 관련 Skill이 있는지 먼저 확인한다.

현재 프로젝트에서는 다음 Skill을 우선 참고한다.

- `feature-sliced-design`
- `nextjs`
- `tailwind-css`
- `frontend-design`
- `supabase`
- `supabase-postgres-best-practices`

역할은 대략 다음과 같다.

```text
feature-sliced-design
→ 프로젝트 구조와 FSD 레이어 판단

nextjs
→ App Router, Server Component, 라우팅, 캐싱 등 Next.js 구현

tailwind-css
→ Tailwind CSS 작성 방식과 스타일링

frontend-design
→ UI/UX, 레이아웃, 반응형, 시각적 완성도

supabase
→ Auth, Database, Storage, SSR 등 Supabase 사용

supabase-postgres-best-practices
→ DB 설계, SQL, RLS, Index, Migration, 성능
```

Skill 내용을 무조건 복사해서 적용하지는 않는다.

현재 프로젝트 구조와 기존 코드가 있다면 그 구조를 먼저 존중한다.

---

## 프로젝트 구조

프론트엔드 구조는 FSD(Feature-Sliced Design)를 기준으로 한다.

```text
src/
├── app/
├── widgets/
├── features/
├── entities/
└── shared/
```

### app

Next.js의 라우팅과 애플리케이션 전역 설정을 담당한다.

예:

- `page.tsx`
- `layout.tsx`
- provider
- metadata
- global style
- loading
- error handling

`page.tsx`와 `layout.tsx`에는 가능한 한 많은 로직을 넣지 않는다.

페이지 파일은 화면을 조합하는 역할 위주로 작성한다.

---

### widgets

여러 feature나 entity를 조합한 큰 UI 영역을 둔다.

예:

- Header
- Sidebar
- DashboardSection
- SearchResultSection

단순 Button이나 Input 같은 공통 UI는 widgets에 두지 않는다.

---

### features

사용자가 수행하는 기능 단위로 구성한다.

예:

- 로그인
- 로그아웃
- 검색
- 필터
- 프로필 수정
- 요청 등록

단순히 화면에 보이는 영역이라는 이유만으로 feature를 만들지 않는다.

---

### entities

서비스의 핵심 도메인 단위를 관리한다.

예:

- user
- company
- document
- request
- product

해당 도메인에서 사용하는 UI, 타입, API, 모델 로직 등을 필요에 따라 함께 둔다.

---

### shared

도메인과 관계없이 프로젝트 전체에서 사용할 수 있는 코드만 둔다.

예:

```text
shared/
├── api/
├── config/
├── hooks/
├── lib/
├── types/
└── ui/
```

여러 곳에서 사용된다는 이유만으로 무조건 `shared`로 옮기지 않는다.

특정 도메인에 종속된 코드는 해당 entity나 feature에 둔다.

---

## FSD 의존성

기본적인 의존 방향은 아래와 같다.

```text
app
↓
widgets
↓
features
↓
entities
↓
shared
```

하위 레이어가 상위 레이어를 import하지 않는다.

가능하면 각 slice의 public API를 통해 import한다.

권장:

```ts
import { UserCard } from "@/entities/user";
```

불필요하게 내부 파일까지 직접 접근하는 deep import는 피한다.

---

## Next.js

App Router를 사용한다.

기본적으로 Server Component를 우선 사용한다.

아래와 같은 경우에만 `"use client"`를 사용한다.

- `useState`
- `useEffect`
- 이벤트 처리
- 브라우저 API
- Client Component 전용 라이브러리

편하다는 이유만으로 페이지 전체를 Client Component로 만들지 않는다.

`page.tsx` 안에 큰 UI와 비즈니스 로직을 모두 작성하지 않는다.

필요한 단위로 widgets, features, entities에 분리한다.

Next.js에서 제공하는 기능을 우선 사용한다.

예:

- `next/image`
- `next/link`
- metadata API

Server Action은 필요한 경우에만 사용한다.

기존 API 구조가 있다면 굳이 Server Action으로 변경하지 않는다.

---

## 컴포넌트

컴포넌트는 하나의 명확한 역할을 가지도록 작성한다.

다음과 같은 경우 분리를 고려한다.

- 하나의 파일에 UI와 비즈니스 로직이 과도하게 섞여 있는 경우
- 특정 영역이 독립적인 역할을 가지는 경우
- 동일한 UI가 반복되는 경우
- 컴포넌트가 너무 복잡해서 흐름을 이해하기 어려운 경우

단순히 줄 수를 줄이기 위해 의미 없는 컴포넌트를 만들지는 않는다.

큰 컴포넌트 하나에 모든 내용을 몰아넣는 방식은 피한다.

---

## TypeScript

가능한 한 타입을 명확하게 작성한다.

`any` 사용은 피한다.

DB 타입이나 기존 타입을 다시 똑같이 선언하지 않는다.

도메인 타입은 해당 entity 또는 feature 근처에서 관리한다.

정말 여러 도메인에서 공통으로 사용하는 타입만 `shared`에 둔다.

---

## Tailwind CSS

스타일링은 기본적으로 Tailwind CSS를 사용한다.

기존 디자인 토큰과 Tailwind utility가 있다면 우선 사용한다.

같은 스타일 문자열이 여러 곳에서 반복되지 않도록 한다.

조건부 className은 프로젝트에서 사용하는 `cn()` 등의 유틸을 사용한다.

Tailwind로 충분히 표현할 수 있는 스타일을 별도 CSS 파일로 만들지 않는다.

반대로 Tailwind로 표현했을 때 오히려 가독성이 떨어진다면 일반 CSS 사용도 허용한다.

---

## UI / 디자인

UI 작업 시 `frontend-design` Skill을 참고한다.

기존 서비스의 디자인 방향을 우선 유지한다.

특별한 이유 없이 아래 요소를 남발하지 않는다.

- 과한 gradient
- 과한 shadow
- 불필요한 rounded card
- 의미 없는 animation
- 장식 목적의 요소

AI가 자동 생성한 것 같은 획일적인 화면보다는 실제 서비스에서 사용할 수 있는 자연스러운 UI를 만든다.

특히 다음을 신경 쓴다.

- 정보 우선순위
- 간격
- 타이포그래피
- 정렬
- 반응형
- hover / focus / disabled 상태

기능 구현과 관계없는 화면까지 임의로 디자인 변경하지 않는다.

---

## Supabase

Supabase 관련 작업은 `supabase`와 `supabase-postgres-best-practices` Skill을 참고한다.

### Client 구성

Browser용 Supabase Client와 Server용 Client를 분리한다.

예:

```text
shared/
└── api/
    └── supabase/
        ├── client.ts
        ├── server.ts
        └── middleware.ts
```

각 역할은 명확하게 구분한다.

```text
client.ts
→ Client Component에서 사용

server.ts
→ Server Component, Route Handler, Server Action에서 사용

middleware.ts
→ 인증 세션 및 Cookie 처리
```

컴포넌트마다 Supabase Client를 새로 만드는 구조는 피한다.

---

## Supabase Auth

인증 여부만 클라이언트 상태로 판단하지 않는다.

보호가 필요한 작업은 서버에서도 로그인 사용자를 확인한다.

클라이언트에서 전달받은 `userId`만 믿고 데이터 접근 권한을 판단하지 않는다.

인증과 권한 검사는 별개의 문제로 본다.

```text
Authentication
→ 누구인지 확인

Authorization
→ 무엇을 할 수 있는지 확인
```

---

## RLS

사용자별 데이터나 접근 제한이 필요한 테이블은 기본적으로 RLS를 사용한다.

Frontend의 조건문은 보안 수단이 아니다.

예를 들어 아래 코드는 UI 제어일 뿐 실제 권한 검사가 아니다.

```ts
if (user.id === ownerId) {
  // ...
}
```

실제 데이터 접근 권한은 DB에서도 제한해야 한다.

사용자 소유 데이터라면 가능한 한 `auth.uid()` 기반으로 정책을 작성한다.

필요한 작업에 맞게 각각 정책을 검토한다.

- SELECT
- INSERT
- UPDATE
- DELETE

개발이 편하다는 이유로 전체 접근을 허용하는 RLS 정책을 만들지 않는다.

---

## Supabase Key

`service_role`을 브라우저에 절대 노출하지 않는다.

특히 아래와 같은 형태로 넣지 않는다.

```text
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
```

`service_role`이 필요한 작업은 반드시 서버에서 수행한다.

RLS 설정이 귀찮다는 이유로 `service_role`을 사용하지 않는다.

---

## Database

DB 제약 조건으로 처리할 수 있는 것은 가능한 한 DB에서도 보장한다.

예:

- Primary Key
- Foreign Key
- Unique
- Not Null
- Check Constraint

TypeScript에서 검사하고 있다고 해서 DB 검증을 생략하지 않는다.

---

## Migration

DB Schema 변경은 Migration으로 관리한다.

Supabase Dashboard에서 직접 수정하고 끝내지 않는다.

다음 변경은 반드시 Migration에 남긴다.

- Table
- Column
- Index
- Constraint
- Function
- RLS Policy

Migration 파일은 Git으로 관리한다.

기존 데이터가 있는 테이블을 수정할 때는 기존 데이터가 새 제약 조건을 만족하는지도 확인한다.

---

## Supabase 타입

가능하면 Supabase에서 생성한 Database Type을 사용한다.

DB Row 타입을 직접 다시 작성하지 않는다.

단, UI나 비즈니스 로직에서 DB 구조를 그대로 사용할 필요가 없다면 도메인 타입으로 변환해서 사용해도 된다.

---

## Supabase Query

UI 컴포넌트 안에서 Supabase query를 직접 반복해서 작성하지 않는다.

예를 들어 이런 코드가 여러 컴포넌트에 흩어지는 구조는 피한다.

```ts
supabase
  .from("profiles")
  .select("*")
  .eq(...)
```

해당 데이터의 책임에 따라 `entities/*/api` 또는 `features/*/api` 등으로 분리한다.

가능하면 의미 있는 함수 단위로 사용한다.

```ts
const profile = await getUserProfile();
```

필요하지 않은 데이터를 무조건 `.select("*")`로 가져오지 않는다.

---

## Index

자주 조회하거나 정렬하는 컬럼은 Index 필요 여부를 확인한다.

특히 아래 항목을 확인한다.

- Foreign Key
- `user_id`
- 검색 조건
- 정렬 조건
- Join 조건

무조건 Index를 추가하지 않고 실제 query 패턴을 기준으로 판단한다.

---

## Storage

Supabase Storage도 DB와 동일하게 권한을 고려한다.

파일 URL을 추측하기 어렵다는 이유만으로 안전하다고 판단하지 않는다.

용도에 따라 Bucket을 구분한다.

예:

- 공개 이미지
- 사용자 개인 파일
- 내부 파일

Private 파일은 Storage Policy까지 함께 확인한다.

---

## Realtime

실시간 업데이트가 실제로 필요한 기능에만 Realtime을 사용한다.

단순히 데이터를 최신 상태로 유지하기 위한 목적이라면 일반적인 refetch나 invalidation으로 충분한지 먼저 확인한다.

사용하지 않는 subscription은 정리한다.

---

## 에러 처리

Supabase 요청의 `error`를 무시하지 않는다.

```ts
const { data, error } = await ...
```

에러 발생 가능성이 있는 요청은 명시적으로 처리한다.

DB 내부 오류나 민감한 정보를 그대로 사용자에게 보여주지 않는다.

---

## 반응형

새로 만드는 화면은 기본적으로 데스크톱과 모바일 환경을 모두 고려한다.

불필요하게 고정 width/height를 사용하지 않는다.

다음 항목을 확인한다.

- overflow
- 줄바꿈
- spacing
- touch target
- table
- dialog
- navigation

---

## 접근성

가능한 한 semantic HTML을 사용한다.

동작에는 `button`, 이동에는 `a` 또는 `Link`를 사용한다.

아이콘만 있는 버튼에는 접근 가능한 label을 제공한다.

키보드 focus를 임의로 제거하지 않는다.

---

## 작업 후 검증

기능을 구현한 뒤 코드 작성만 하고 끝내지 않는다.

UI나 사용자 흐름이 변경된 경우 Playwright로 실제 동작을 확인한다.

최소한 다음 항목을 확인한다.

- 페이지가 정상적으로 렌더링되는지
- 핵심 기능이 동작하는지
- Runtime Error가 없는지
- 레이아웃이 깨지지 않는지
- 변경한 기능이 의도대로 동작하는지

Supabase 관련 변경이 있다면 필요한 경우 아래 항목도 확인한다.

- 로그인 / 로그아웃
- Session
- RLS
- SELECT
- INSERT
- UPDATE
- DELETE
- Migration
- Constraint

RLS를 수정했다면 정상 사용자뿐 아니라 권한이 없는 사용자 접근도 확인한다.

---

## CHANGE_LOGS.md

의미 있는 기능 추가나 수정이 있다면 `CHANGE_LOGS.md`에 간단하게 기록한다.

다음 정도만 남긴다.

- 변경 내용
- 구조 변경이 있다면 해당 내용
- DB / Migration 변경
- 검증 결과

단순 포맷 변경이나 사소한 수정까지 기록할 필요는 없다.

---

## 작업 완료 전 확인

작업을 끝내기 전에 아래 내용을 한 번 확인한다.

- FSD 의존 방향을 위반하지 않았는가
- `page.tsx`에 로직이 몰려 있지 않은가
- 큰 컴포넌트를 적절하게 분리했는가
- 불필요한 `"use client"`가 없는가
- 기존 컴포넌트를 재사용할 수 있었는가
- Supabase Browser / Server Client가 올바르게 분리되어 있는가
- Supabase Secret Key가 Client에 노출되지 않았는가
- 필요한 테이블에 RLS가 적용되어 있는가
- DB 변경 사항이 Migration으로 남아 있는가
- 사용하지 않는 코드나 import가 남아 있지 않은가
- TypeScript 오류가 없는가
- 반응형을 확인했는가
- 필요한 Playwright 테스트를 수행했는가
- 필요한 경우 `CHANGE_LOGS.md`를 수정했는가

복잡한 구조보다 현재 요구사항을 만족하는 가장 단순한 구현을 우선한다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
