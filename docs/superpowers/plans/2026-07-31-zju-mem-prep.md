# ZJU MEM Prep Site (Phase 1 Notes Library) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable Next.js + Supabase web app where the user can log in, browse seeded 逻辑/数学/英语二 knowledge skeletons, edit personal notes (Markdown), search, star, and set mastery — synced across devices.

**Architecture:** Next.js App Router talks to Supabase Auth + Postgres. System template rows (`user_id` null) are read-only; per-user overrides and custom points live in `user_point_state` / user-owned rows. UI is “日间课桌” (light sage) with a desktop chapter sidebar that becomes a mobile drawer.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Supabase JS v2, `@supabase/ssr`, `react-markdown`, Vitest, Vercel deploy.

**Spec:** `docs/superpowers/specs/2026-07-31-zju-mem-prep-design.md`

## Global Constraints

- Phase 1 only: notes library — no quiz, wrong-book, check-in, WeChat login, or PWA
- Subjects fixed: `logic` / `math` / `english2` (逻辑 / 数学 / 英语二)
- Auth: email + password via Supabase
- Visual: daylight desk — CSS variables `--bg #f3f6f4`, `--ink #1c2b24`, `--accent #3d7a5f`, `--surface #ffffff`, `--muted #5f7168`, `--border #d5e0da`
- Brand on home is hero-level: 「工程管理备考」
- Layout: left chapter tree on desktop; drawer on mobile (`max-width: 768px`)
- Template vs user: overrides win over template title/body; never write to template rows from the client
- Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Conventional commits; Chinese UI copy OK
- App lives at repo root (alongside `docs/`); ignore `.superpowers/`, `.env*`

---

## File Map

| Path | Responsibility |
|------|----------------|
| `package.json` | Dependencies & scripts |
| `app/layout.tsx` | Root layout, fonts, CSS vars |
| `app/globals.css` | Daylight-desk tokens & base |
| `app/page.tsx` | Home (subjects + recent + starred) |
| `app/login/page.tsx` | Login |
| `app/register/page.tsx` | Register |
| `app/subjects/[slug]/page.tsx` | Subject + sidebar + list |
| `app/points/[id]/page.tsx` | Point detail |
| `app/points/[id]/edit/page.tsx` | Edit point |
| `app/points/new/page.tsx` | Create point |
| `app/search/page.tsx` | Search |
| `app/auth/callback/route.ts` | Auth code exchange if needed |
| `middleware.ts` | Session refresh + protect routes |
| `lib/supabase/client.ts` | Browser Supabase client |
| `lib/supabase/server.ts` | Server Supabase client |
| `lib/supabase/middleware.ts` | Middleware client helper |
| `lib/types.ts` | Shared domain types |
| `lib/points.ts` | `resolvePoint`, mastery cycle helpers |
| `lib/data/*.ts` | Server data loaders / mutations |
| `components/**` | UI pieces (sidebar, mastery, editor, …) |
| `supabase/migrations/001_init.sql` | Schema + RLS |
| `supabase/seed.sql` | Template subjects/chapters/points |
| `lib/points.test.ts` | Unit tests for resolve helpers |
| `.env.example` | Env template |
| `README.md` | Setup & deploy |

---

### Task 1: Scaffold Next.js + Vitest + design tokens

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx` (placeholder), `.env.example`, `README.md`
- Test: smoke via `npm run build` later; unit runner via `npm test`

**Interfaces:**
- Produces: runnable Next app; CSS variables listed in Global Constraints; scripts `dev`, `build`, `test`

- [ ] **Step 1: Scaffold the app at repo root**

Run (PowerShell from repo root `考研`):

```powershell
npx create-next-app@15 . --typescript --eslint --app --src-dir=false --tailwind=false --import-alias "@/*" --turbopack --yes
```

If create-next-app refuses non-empty dir, create in temp and move `app/`, `public/`, config files into root, merging with existing `docs/` and `.gitignore`.

- [ ] **Step 2: Add dependencies**

```powershell
npm install @supabase/supabase-js @supabase/ssr react-markdown
npm install -D vitest @vitejs/plugin-react jsdom
```

- [ ] **Step 3: Add Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: { environment: "node" },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 4: Write daylight-desk globals**

Replace `app/globals.css`:

```css
:root {
  --bg: #f3f6f4;
  --ink: #1c2b24;
  --accent: #3d7a5f;
  --surface: #ffffff;
  --muted: #5f7168;
  --border: #d5e0da;
  --accent-soft: #e8f2ec;
  --font-sans: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

* { box-sizing: border-box; }
html, body {
  margin: 0;
  padding: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-sans);
  line-height: 1.5;
}
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
button, input, textarea, select {
  font: inherit;
  color: inherit;
}
```

Update `app/layout.tsx` to import `./globals.css`, set `metadata.title` to `工程管理备考`, `lang="zh-CN"`.

- [ ] **Step 5: Write `.env.example`**

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts vitest.config.ts app .env.example README.md
git commit -m "chore: scaffold Next.js app with daylight-desk tokens"
```

---

### Task 2: Domain helpers + unit tests (`resolvePoint`)

**Files:**
- Create: `lib/types.ts`, `lib/points.ts`, `lib/points.test.ts`

**Interfaces:**
- Produces:
  - `export type Mastery = "unlearned" | "fuzzy" | "mastered"`
  - `export type KnowledgePoint = { id: string; chapter_id: string; title: string; body_md: string; sort_order: number; user_id: string | null; source_template_id: string | null }`
  - `export type UserPointState = { user_id: string; knowledge_point_id: string; mastery: Mastery; starred: boolean; body_override_md: string | null; title_override: string | null; updated_at: string }`
  - `export type ResolvedPoint = { id: string; chapter_id: string; title: string; body_md: string; mastery: Mastery; starred: boolean; isUserOwned: boolean; updated_at: string | null }`
  - `export function resolvePoint(point: KnowledgePoint, state: UserPointState | null): ResolvedPoint`
  - `export function nextMastery(current: Mastery): Mastery` — cycles `unlearned → fuzzy → mastered → unlearned`

- [ ] **Step 1: Write failing tests**

Create `lib/points.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { nextMastery, resolvePoint } from "./points";
import type { KnowledgePoint, UserPointState } from "./types";

const template: KnowledgePoint = {
  id: "p1",
  chapter_id: "c1",
  title: "假言推理",
  body_md: "模板正文",
  sort_order: 1,
  user_id: null,
  source_template_id: null,
};

describe("resolvePoint", () => {
  it("uses template when no state", () => {
    const r = resolvePoint(template, null);
    expect(r.title).toBe("假言推理");
    expect(r.body_md).toBe("模板正文");
    expect(r.mastery).toBe("unlearned");
    expect(r.starred).toBe(false);
    expect(r.isUserOwned).toBe(false);
  });

  it("prefers overrides", () => {
    const state: UserPointState = {
      user_id: "u1",
      knowledge_point_id: "p1",
      mastery: "fuzzy",
      starred: true,
      body_override_md: "我的笔记",
      title_override: "假言·个人",
      updated_at: "2026-07-31T00:00:00Z",
    };
    const r = resolvePoint(template, state);
    expect(r.title).toBe("假言·个人");
    expect(r.body_md).toBe("我的笔记");
    expect(r.mastery).toBe("fuzzy");
    expect(r.starred).toBe(true);
  });
});

describe("nextMastery", () => {
  it("cycles three states", () => {
    expect(nextMastery("unlearned")).toBe("fuzzy");
    expect(nextMastery("fuzzy")).toBe("mastered");
    expect(nextMastery("mastered")).toBe("unlearned");
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```powershell
npm test
```

Expected: fail — `Cannot find module './points'` or similar.

- [ ] **Step 3: Implement types + helpers**

`lib/types.ts` — export the types listed in Interfaces.

`lib/points.ts`:

```ts
import type { KnowledgePoint, Mastery, ResolvedPoint, UserPointState } from "./types";

export function resolvePoint(
  point: KnowledgePoint,
  state: UserPointState | null,
): ResolvedPoint {
  return {
    id: point.id,
    chapter_id: point.chapter_id,
    title: state?.title_override ?? point.title,
    body_md: state?.body_override_md ?? point.body_md,
    mastery: state?.mastery ?? "unlearned",
    starred: state?.starred ?? false,
    isUserOwned: point.user_id != null,
    updated_at: state?.updated_at ?? null,
  };
}

export function nextMastery(current: Mastery): Mastery {
  if (current === "unlearned") return "fuzzy";
  if (current === "fuzzy") return "mastered";
  return "unlearned";
}
```

- [ ] **Step 4: Run tests — expect PASS**

```powershell
npm test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts lib/points.ts lib/points.test.ts
git commit -m "feat: add resolvePoint and mastery helpers with tests"
```

---

### Task 3: Supabase SQL schema, RLS, and seed

**Files:**
- Create: `supabase/migrations/001_init.sql`, `supabase/seed.sql`

**Interfaces:**
- Produces: tables `subjects`, `chapters`, `knowledge_points`, `user_point_state` matching the spec; RLS as specified; seed for three subjects

- [ ] **Step 1: Write migration SQL**

Create `supabase/migrations/001_init.sql` with:

```sql
create type public.mastery as enum ('unlearned', 'fuzzy', 'mastered');

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order int not null default 0
);

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  parent_id uuid references public.chapters(id) on delete cascade,
  title text not null,
  sort_order int not null default 0,
  user_id uuid references auth.users(id) on delete cascade
);

create table public.knowledge_points (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  title text not null,
  body_md text not null default '',
  sort_order int not null default 0,
  user_id uuid references auth.users(id) on delete cascade,
  source_template_id uuid references public.knowledge_points(id) on delete set null
);

create table public.user_point_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  knowledge_point_id uuid not null references public.knowledge_points(id) on delete cascade,
  mastery public.mastery not null default 'unlearned',
  starred boolean not null default false,
  body_override_md text,
  title_override text,
  updated_at timestamptz not null default now(),
  primary key (user_id, knowledge_point_id)
);

create index chapters_subject_idx on public.chapters(subject_id);
create index points_chapter_idx on public.knowledge_points(chapter_id);
create index ups_user_updated_idx on public.user_point_state(user_id, updated_at desc);

alter table public.subjects enable row level security;
alter table public.chapters enable row level security;
alter table public.knowledge_points enable row level security;
alter table public.user_point_state enable row level security;

-- subjects: authenticated read
create policy subjects_read on public.subjects for select to authenticated using (true);

-- chapters: read templates or own; insert/update/delete own only
create policy chapters_read on public.chapters for select to authenticated
  using (user_id is null or user_id = auth.uid());
create policy chapters_insert on public.chapters for insert to authenticated
  with check (user_id = auth.uid());
create policy chapters_update on public.chapters for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy chapters_delete on public.chapters for delete to authenticated
  using (user_id = auth.uid());

-- knowledge_points: same pattern
create policy points_read on public.knowledge_points for select to authenticated
  using (user_id is null or user_id = auth.uid());
create policy points_insert on public.knowledge_points for insert to authenticated
  with check (user_id = auth.uid());
create policy points_update on public.knowledge_points for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy points_delete on public.knowledge_points for delete to authenticated
  using (user_id = auth.uid());

-- user_point_state: own rows only
create policy ups_select on public.user_point_state for select to authenticated
  using (user_id = auth.uid());
create policy ups_insert on public.user_point_state for insert to authenticated
  with check (user_id = auth.uid());
create policy ups_update on public.user_point_state for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy ups_delete on public.user_point_state for delete to authenticated
  using (user_id = auth.uid());
```

- [ ] **Step 2: Write seed SQL**

Create `supabase/seed.sql` that inserts three subjects and chapters/points per spec §6. Use fixed UUIDs for stability, e.g.:

```sql
-- subjects
insert into public.subjects (id, slug, name, sort_order) values
  ('11111111-1111-1111-1111-111111111101', 'logic', '逻辑', 1),
  ('11111111-1111-1111-1111-111111111102', 'math', '数学', 2),
  ('11111111-1111-1111-1111-111111111103', 'english2', '英语二', 3);

-- For each subject: insert chapters (user_id null) and 1–3 knowledge_points
-- with short body_md outlines (e.g. bullet list of key ideas).
-- Logic chapters: 形式逻辑, 论证评价, 削弱与加强, 假设, 归纳与类比, 其他题型
-- Math: 算术, 代数, 几何, 数据分析
-- English2: 词汇与语法, 阅读理解, 完形填空, 英译汉, 写作
```

Fill concrete `insert` rows in the real file (no placeholders) — each chapter at least one point with 2–5 lines of Markdown outline.

- [ ] **Step 3: Document apply steps in README**

Add section: create Supabase project → SQL Editor run `001_init.sql` then `seed.sql` → Auth → disable “Confirm email” for local/dev → copy URL + anon key to `.env.local`.

- [ ] **Step 4: Commit**

```bash
git add supabase README.md
git commit -m "feat: add Supabase schema, RLS, and seed skeleton"
```

---

### Task 4: Supabase clients + auth middleware

**Files:**
- Create: `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/middleware.ts`, `middleware.ts`, `app/auth/callback/route.ts`

**Interfaces:**
- Produces:
  - `createBrowserClient()` from `lib/supabase/client.ts`
  - `createServerClient()` async from `lib/supabase/server.ts`
  - Middleware refreshes session; unauthenticated users hitting `/`, `/subjects/*`, `/points/*`, `/search` redirect to `/login`

- [ ] **Step 1: Implement browser client**

```ts
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
```

- [ ] **Step 2: Implement server client** (cookie-based, per Supabase SSR docs for Next.js App Router)

```ts
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* called from Server Component — ignore */
          }
        },
      },
    },
  );
}
```

- [ ] **Step 3: Middleware helper + `middleware.ts`**

Protect all routes except `/login`, `/register`, `/auth/callback`, and static assets. Pattern: create middleware Supabase client, `getUser()`, if no user and path is protected → `NextResponse.redirect(login)`.

- [ ] **Step 4: Auth callback route**

`app/auth/callback/route.ts` — exchange `code` for session via `exchangeCodeForSession`, redirect `/`.

- [ ] **Step 5: Manual check**

With `.env.local` set, `npm run dev` — visiting `/` without login redirects to `/login`.

- [ ] **Step 6: Commit**

```bash
git add lib/supabase middleware.ts app/auth
git commit -m "feat: add Supabase SSR clients and auth middleware"
```

---

### Task 5: Login & register pages

**Files:**
- Create: `app/login/page.tsx`, `app/register/page.tsx`, `components/AuthForm.tsx`
- Modify: `app/globals.css` (form styles if needed)

**Interfaces:**
- Consumes: `createClient()` from `lib/supabase/client.ts`
- Produces: email/password sign-in and sign-up; on success navigate to `/`; show Chinese error messages

- [ ] **Step 1: Build `AuthForm`**

Props: `mode: "login" | "register"`. Fields: email, password. On submit:

- login → `supabase.auth.signInWithPassword({ email, password })`
- register → `supabase.auth.signUp({ email, password })`

Style with daylight tokens (white surface, green button `#3d7a5f`, full-width on mobile).

- [ ] **Step 2: Wire pages**

`/login` and `/register` with links to each other. Brand line: 「工程管理备考」.

- [ ] **Step 3: Manual test**

Register a user in local Supabase → lands on home (home may still be placeholder) → logout via temporary link or SQL if needed.

- [ ] **Step 4: Commit**

```bash
git add app/login app/register components/AuthForm.tsx
git commit -m "feat: add email/password login and register"
```

---

### Task 6: Data access layer

**Files:**
- Create: `lib/data/subjects.ts`, `lib/data/points.ts`, `lib/data/search.ts`

**Interfaces:**
- Consumes: server `createClient()`, `resolvePoint`
- Produces (all server-side, throw/return null on missing):
  - `listSubjects(): Promise<{ id; slug; name; sort_order }[]>`
  - `getSubjectBySlug(slug: string)`
  - `listChaptersForSubject(subjectId: string)` — templates + current user’s chapters, ordered
  - `listPointsForChapter(chapterId: string, userId: string): Promise<ResolvedPoint[]>`
  - `getResolvedPoint(pointId: string, userId: string): Promise<ResolvedPoint | null>`
  - `upsertPointState(userId, pointId, patch: Partial<Pick<UserPointState, "mastery" | "starred" | "body_override_md" | "title_override">>)`
  - `createUserPoint({ userId, chapterId, title, body_md })`
  - `updateUserPoint({ userId, pointId, title, body_md })` — only if `user_id` matches; for templates, write overrides via `upsertPointState`
  - `deleteUserPoint(userId, pointId)` — only user-owned
  - `listRecent(userId, limit=8)`, `listStarred(userId)`
  - `searchPoints(userId, query: string): Promise<ResolvedPoint[]>` — `ilike` on title/body of readable points, then resolve

- [ ] **Step 1: Implement `lib/data/subjects.ts` and `lib/data/points.ts` and `lib/data/search.ts`** with the signatures above. For template edits: if `point.user_id` is null, saving content calls `upsertPointState` with `title_override` / `body_override_md` instead of updating `knowledge_points`.

- [ ] **Step 2: Spot-check with a temporary Server Component or `npm run dev` after next tasks; commit when functions compile.

```bash
git add lib/data
git commit -m "feat: add server data loaders and point mutations"
```

---

### Task 7: App shell + home page

**Files:**
- Create: `components/AppHeader.tsx`, `components/SubjectCard.tsx`
- Modify: `app/page.tsx`, `app/layout.tsx`

**Interfaces:**
- Consumes: `listSubjects`, `listRecent`, `listStarred`
- Produces: home with hero brand 「工程管理备考」, one supporting line, three subject links, recent + starred lists; header with search link + logout

- [ ] **Step 1: `AppHeader`** — logo text links home; links 搜索; button 退出 (`signOut` then `/login`).

- [ ] **Step 2: Home page (server component)** — require user; fetch subjects/recent/starred; render hero then subject cards (not nested “dashboard clutter”: one composition — brand, sentence, CTA subjects, then secondary recent/starred below fold OK).

Hero copy example:

- Brand: 工程管理备考  
- Line: 逻辑 · 数学 · 英语二 — 知识点整理与复习  

- [ ] **Step 3: Manual** — logged-in home shows three subjects.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/layout.tsx components/AppHeader.tsx components/SubjectCard.tsx
git commit -m "feat: add home page with subjects, recent, and starred"
```

---

### Task 8: Subject page with chapter sidebar (+ mobile drawer)

**Files:**
- Create: `components/ChapterSidebar.tsx`, `components/PointList.tsx`, `app/subjects/[slug]/page.tsx`
- Modify: `app/globals.css` (sidebar/drawer)

**Interfaces:**
- Consumes: `getSubjectBySlug`, `listChaptersForSubject`, `listPointsForChapter`
- Query: `?chapter=<id>` selects chapter; default first chapter
- Mobile: sidebar hidden; button 「章节」 opens drawer overlay

- [ ] **Step 1: Implement `ChapterSidebar`** — list chapters; active state uses `--accent-soft` / left border accent.

- [ ] **Step 2: Implement subject page** — desktop CSS grid `240px 1fr`; mobile single column + drawer.

CSS sketch:

```css
.subject-layout { display: grid; grid-template-columns: 240px 1fr; gap: 1rem; }
@media (max-width: 768px) {
  .subject-layout { grid-template-columns: 1fr; }
  .chapter-sidebar.desktop-only { display: none; }
}
```

Drawer: fixed panel, toggled by client component state (`ChapterDrawer.tsx` if needed).

- [ ] **Step 3: Point list links to `/points/[id]`**.

- [ ] **Step 4: Manual** — open 逻辑, switch chapters, resize to mobile drawer.

- [ ] **Step 5: Commit**

```bash
git add app/subjects components/ChapterSidebar.tsx components/PointList.tsx components/ChapterDrawer.tsx app/globals.css
git commit -m "feat: add subject page with chapter sidebar and mobile drawer"
```

---

### Task 9: Point detail — Markdown, mastery, star

**Files:**
- Create: `app/points/[id]/page.tsx`, `components/MasteryControl.tsx`, `components/StarButton.tsx`, `components/MarkdownBody.tsx`
- Possibly: `app/points/[id]/actions.ts` (server actions)

**Interfaces:**
- Consumes: `getResolvedPoint`, `upsertPointState`, `nextMastery`, `react-markdown`
- Produces: detail view; cycle mastery; toggle star (both update `updated_at` via DB default/`now()` on upsert)

- [ ] **Step 1: `MarkdownBody`** — render `react-markdown` with simple heading/list/code styles in CSS.

- [ ] **Step 2: Client controls** call server actions that `upsertPointState` then `revalidatePath`.

- [ ] **Step 3: Detail page** — title, mastery, star, edit link, body; if user-owned show delete.

- [ ] **Step 4: Manual** — cycle mastery, star, refresh other browser/device (or private window same account) to confirm sync.

- [ ] **Step 5: Commit**

```bash
git add app/points components/MasteryControl.tsx components/StarButton.tsx components/MarkdownBody.tsx
git commit -m "feat: add knowledge point detail with mastery and star"
```

---

### Task 10: Create / edit / delete points

**Files:**
- Create: `app/points/new/page.tsx`, `app/points/[id]/edit/page.tsx`, `components/PointEditor.tsx`

**Interfaces:**
- Consumes: data layer create/update/delete + override rules from Task 6
- `new` requires `?chapter=<uuid>`
- Editor: title input + textarea for Markdown + optional preview tab

- [ ] **Step 1: `PointEditor` client form** submitting to server actions.

- [ ] **Step 2: Edit page** — load resolved title/body into form; on save apply template-vs-user rule.

- [ ] **Step 3: New page** — create user-owned row; redirect to detail.

- [ ] **Step 4: Delete** — confirm dialog; only user-owned; redirect to subject.

- [ ] **Step 5: Manual** — edit a template point (stores override); create personal point; delete personal point.

- [ ] **Step 6: Commit**

```bash
git add app/points/new app/points/[id]/edit components/PointEditor.tsx
git commit -m "feat: add create, edit, and delete for knowledge points"
```

---

### Task 11: Search page

**Files:**
- Create: `app/search/page.tsx`

**Interfaces:**
- Consumes: `searchPoints(userId, q)`
- UI: search input (`q` query param), results list linking to `/points/[id]`

- [ ] **Step 1: Implement search page** (server component reading `searchParams.q`).

- [ ] **Step 2: Manual** — search「假言」 returns logic points.

- [ ] **Step 3: Commit**

```bash
git add app/search
git commit -m "feat: add cross-subject knowledge search"
```

---

### Task 12: Polish README + deploy checklist

**Files:**
- Modify: `README.md`

**Interfaces:**
- Produces: step-by-step local run + Vercel + Supabase production notes (email confirm on in prod)

- [ ] **Step 1: Expand README** with: clone, `.env.local`, apply SQL, `npm run dev`, `npm test`, deploy to Vercel (set env vars), Auth URL config for production domain.

- [ ] **Step 2: Run full verification**

```powershell
npm test
npm run build
```

Expected: tests pass; build succeeds.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add setup and Vercel deploy guide"
```

---

## Self-Review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| Email/password auth + multi-device sync | 4, 5 |
| Three subjects + seeded skeleton | 3, 7, 8 |
| CRUD notes Markdown | 9, 10 |
| Search / star / mastery | 9, 11 |
| Daylight desk + sidebar/drawer | 1, 8 |
| Template + user override layer | 2, 3, 6, 10 |
| Vercel/Supabase env | 3, 12 |
| No phase-2/3 features | Global Constraints |

No TBD placeholders left in task steps; seed file must contain concrete INSERTs when implemented (Task 3 Step 2 spells required chapter lists).

---

## Execution Handoff

Plan saved to `docs/superpowers/plans/2026-07-31-zju-mem-prep.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  
2. **Inline Execution** — run tasks in this session with executing-plans checkpoints  

Which approach?
