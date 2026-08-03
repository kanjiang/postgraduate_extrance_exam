# Practice Question Bank Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real practice system: batch-extract questions from `考研材料` PDFs into Supabase, then let the user practice by chapter, score MCQs on submit, self-mark short answers, and re-drill a wrong book.

**Architecture:** Extend the existing Next.js + Supabase app. New tables hold questions, sessions, answers, and wrong-book rows. A local Python script extracts PDF text and writes JSON banks that import via SQL. Practice pages use server actions mirroring `app/today/actions.ts`.

**Tech Stack:** Next.js 15 App Router, TypeScript, Supabase Postgres + RLS, Vitest, PyMuPDF (`pymupdf`) for extraction, existing daylight-desk CSS.

**Spec:** `docs/superpowers/specs/2026-08-02-practice-question-bank-design.md`

## Global Constraints

- Visual: daylight desk — CSS variables `--bg #f3f6f4`, `--ink #1c2b24`, `--accent #3d7a5f`, `--surface #ffffff`, `--muted #5f7168`, `--border #d5e0da`
- Auth: email + password; all practice routes require login (existing middleware)
- Env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Do not upload raw PDFs to Vercel; only structured questions
- MCQ auto-grade on submit; short answers self-marked after seeing explanation
- Finish set then score (no per-question reveal while answering)
- Conventional commits; Chinese UI copy OK
- Personal prep stage: authenticated users may edit system questions for review

---

## File Map

| Path | Responsibility |
|------|----------------|
| `lib/types.ts` | Add Question, PracticeSession, PracticeAnswer, WrongBookEntry |
| `lib/practice.ts` | Pure helpers: gradeMcq, scoreSession, normalizeAnswerKey |
| `lib/practice.test.ts` | Unit tests for grading helpers |
| `lib/data/practice.ts` | Supabase loaders/mutations for practice |
| `app/practice/actions.ts` | Server actions: start, save draft answers, submit, self-mark, wrong-book drill |
| `app/practice/page.tsx` | Practice hub by subject/chapter |
| `app/practice/c/[chapterId]/page.tsx` | Chapter practice UI |
| `app/practice/session/[id]/page.tsx` | Results + short self-mark |
| `app/practice/wrong/page.tsx` | Wrong book list + re-drill CTA |
| `app/practice/new/page.tsx` | Create question form |
| `app/practice/q/[id]/edit/page.tsx` | Edit question |
| `components/practice/*` | Question form, option radios, result row |
| `supabase/migrations/006_practice_schema.sql` | Tables + RLS |
| `supabase/migrations/006b_math_chapters.sql` | Extra math chapters |
| `content/questions/pdf_chapter_map.json` | PDF path → chapter id |
| `content/questions/bank/**/*.json` | Structured question banks |
| `scripts/extract_pdf_text.py` | PDF → raw text |
| `scripts/build_question_seed.py` | JSON banks → SQL seed |
| `supabase/migrations/007_questions_seed.sql` | Generated / curated seed (batch) |
| `components/AppHeader.tsx` | Add 练习 link |
| `app/nav/page.tsx` | Add practice nav cards |
| `app/subjects/[slug]/page.tsx` | 「去练习」link |
| `docs/DEPLOY.md` | Note new SQL migrations for practice |

---

### Task 1: Domain types + grading helpers (TDD)

**Files:**
- Modify: `lib/types.ts`
- Create: `lib/practice.ts`
- Create: `lib/practice.test.ts`

**Interfaces:**
- Produces: `gradeMcq(answer: string, correct: string): boolean`, `normalizeAnswerKey(s: string): string`, `computeMcqScore(rows: { is_correct: boolean | null; qtype: "mcq" | "short" }[]): { correct: number; total: number }`

- [ ] **Step 1: Write failing tests**

```ts
// lib/practice.test.ts
import { describe, expect, it } from "vitest";
import { computeMcqScore, gradeMcq, normalizeAnswerKey } from "./practice";

describe("normalizeAnswerKey", () => {
  it("trims and uppercases", () => {
    expect(normalizeAnswerKey(" a ")).toBe("A");
  });
});

describe("gradeMcq", () => {
  it("matches ignoring case/space", () => {
    expect(gradeMcq("b", "B")).toBe(true);
    expect(gradeMcq("C", "A")).toBe(false);
  });
});

describe("computeMcqScore", () => {
  it("counts only mcq rows", () => {
    expect(
      computeMcqScore([
        { qtype: "mcq", is_correct: true },
        { qtype: "mcq", is_correct: false },
        { qtype: "short", is_correct: true },
      ]),
    ).toEqual({ correct: 1, total: 2 });
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `npm test -- lib/practice.test.ts`  
Expected: FAIL (module not found)

- [ ] **Step 3: Add types + implementation**

Append to `lib/types.ts`:

```ts
export type QuestionType = "mcq" | "short";

export type QuestionOption = { key: string; text: string };

export type Question = {
  id: string;
  chapter_id: string;
  qtype: QuestionType;
  stem: string;
  options: QuestionOption[] | null;
  answer: string;
  explanation: string;
  source_file: string | null;
  source_page: number | null;
  needs_review: boolean;
  sort_order: number;
  user_id: string | null;
};

export type PracticeMode = "chapter" | "wrong_book";

export type PracticeSession = {
  id: string;
  user_id: string;
  chapter_id: string | null;
  mode: PracticeMode;
  started_at: string;
  finished_at: string | null;
  mcq_correct: number;
  mcq_total: number;
  short_marked_correct: number;
  short_total: number;
};

export type PracticeAnswer = {
  session_id: string;
  question_id: string;
  user_answer: string;
  is_correct: boolean | null;
  self_marked: boolean;
};

export type WrongBookEntry = {
  user_id: string;
  question_id: string;
  wrong_count: number;
  last_wrong_at: string;
  cleared_at: string | null;
};
```

Create `lib/practice.ts`:

```ts
import type { QuestionType } from "./types";

export function normalizeAnswerKey(s: string): string {
  return s.trim().toUpperCase();
}

export function gradeMcq(userAnswer: string, correct: string): boolean {
  return normalizeAnswerKey(userAnswer) === normalizeAnswerKey(correct);
}

export function computeMcqScore(
  rows: { is_correct: boolean | null; qtype: QuestionType }[],
): { correct: number; total: number } {
  const mcq = rows.filter((r) => r.qtype === "mcq");
  return {
    total: mcq.length,
    correct: mcq.filter((r) => r.is_correct === true).length,
  };
}
```

- [ ] **Step 4: Run tests — expect PASS**

Run: `npm test -- lib/practice.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts lib/practice.ts lib/practice.test.ts
git commit -m "feat: add practice grading helpers and types"
```

---

### Task 2: Supabase schema + extra math chapters

**Files:**
- Create: `supabase/migrations/006_practice_schema.sql`
- Create: `supabase/migrations/006b_math_chapters.sql`

**Interfaces:**
- Produces: tables `questions`, `practice_sessions`, `practice_answers`, `wrong_book` with RLS; new chapter UUIDs listed below

Stable chapter IDs to add (math):

| id | title | sort_order |
|----|-------|------------|
| `22222222-2222-2222-2222-222222222217` | 平面几何 | 7 |
| `22222222-2222-2222-2222-222222222218` | 解析几何 | 8 |
| `22222222-2222-2222-2222-222222222219` | 立体几何 | 9 |
| `22222222-2222-2222-2222-22222222221a` | 排列组合 | 10 |
| `22222222-2222-2222-2222-22222222221b` | 概率 | 11 |
| `22222222-2222-2222-2222-22222222221c` | 数据描述 | 12 |

(Use hex-safe UUIDs: prefer `...2217`–`...221c` as above; if Postgres rejects `a`–`c` in that position, use `22222222-2222-2222-2222-222222222230`–`235` instead — pick one scheme and keep it in the map JSON.)

- [ ] **Step 1: Write `006_practice_schema.sql`**

```sql
create type public.question_type as enum ('mcq', 'short');
create type public.practice_mode as enum ('chapter', 'wrong_book');

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  qtype public.question_type not null,
  stem text not null,
  options jsonb,
  answer text not null default '',
  explanation text not null default '',
  source_file text,
  source_page int,
  needs_review boolean not null default false,
  sort_order int not null default 0,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_id uuid references public.chapters(id) on delete set null,
  mode public.practice_mode not null default 'chapter',
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  mcq_correct int not null default 0,
  mcq_total int not null default 0,
  short_marked_correct int not null default 0,
  short_total int not null default 0
);

create table public.practice_answers (
  session_id uuid not null references public.practice_sessions(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  user_answer text not null default '',
  is_correct boolean,
  self_marked boolean not null default false,
  primary key (session_id, question_id)
);

create table public.wrong_book (
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  wrong_count int not null default 1,
  last_wrong_at timestamptz not null default now(),
  cleared_at timestamptz,
  primary key (user_id, question_id)
);

create index questions_chapter_idx on public.questions(chapter_id, sort_order);
create index practice_sessions_user_idx on public.practice_sessions(user_id, started_at desc);
create index wrong_book_user_active_idx on public.wrong_book(user_id) where cleared_at is null;

alter table public.questions enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.practice_answers enable row level security;
alter table public.wrong_book enable row level security;

create policy questions_select on public.questions for select to authenticated
  using (user_id is null or user_id = auth.uid());
create policy questions_insert on public.questions for insert to authenticated
  with check (user_id = auth.uid() or user_id is null);
create policy questions_update on public.questions for update to authenticated
  using (user_id is null or user_id = auth.uid())
  with check (user_id is null or user_id = auth.uid());
create policy questions_delete on public.questions for delete to authenticated
  using (user_id = auth.uid());

create policy sessions_all on public.practice_sessions for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy answers_select on public.practice_answers for select to authenticated
  using (exists (select 1 from public.practice_sessions s where s.id = session_id and s.user_id = auth.uid()));
create policy answers_insert on public.practice_answers for insert to authenticated
  with check (exists (select 1 from public.practice_sessions s where s.id = session_id and s.user_id = auth.uid()));
create policy answers_update on public.practice_answers for update to authenticated
  using (exists (select 1 from public.practice_sessions s where s.id = session_id and s.user_id = auth.uid()));

create policy wrong_book_all on public.wrong_book for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
```

Note: If allowing `user_id is null` inserts from the anon key is too open for production multi-tenant, restrict system inserts to SQL Editor / service role only — for this personal site, seed via SQL Editor; app inserts should set `user_id = auth.uid()`. Adjust insert policy to:

```sql
with check (user_id = auth.uid());
```

and keep system rows inserted only via SQL migrations.

- [ ] **Step 2: Write `006b_math_chapters.sql`** inserting the six chapters for subject `11111111-1111-1111-1111-111111111102` with the stable IDs above (`on conflict do update`).

- [ ] **Step 3: Document for user** — run in Supabase SQL Editor after `001`/`step*` already applied: `006_practice_schema.sql` then `006b_math_chapters.sql`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/006_practice_schema.sql supabase/migrations/006b_math_chapters.sql
git commit -m "feat: add practice schema and math chapters"
```

---

### Task 3: Data layer `lib/data/practice.ts`

**Files:**
- Create: `lib/data/practice.ts`

**Interfaces:**
- Consumes: Supabase server client pattern from `lib/data/schedule.ts`
- Produces:
  - `listChapterQuestionCounts(): Promise<{ chapter_id: string; total: number; needs_review: number }[]>`
  - `listQuestionsForChapter(chapterId: string): Promise<Question[]>`
  - `listActiveWrongQuestions(userId: string): Promise<Question[]>`
  - `getQuestion(id: string): Promise<Question | null>`
  - `upsertQuestion(...): Promise<string>`
  - `createSession(userId, { mode, chapterId, questionIds }): Promise<string>`
  - `saveAnswers(sessionId, answers: { questionId, userAnswer }[]): Promise<void>`
  - `submitSession(sessionId, userId): Promise<PracticeSession>` — grades MCQs, upserts wrong_book
  - `selfMarkAnswer(sessionId, questionId, correct: boolean, userId): Promise<void>`
  - `getSessionBundle(sessionId, userId): Promise<{ session, answers, questions }>`

- [ ] **Step 1: Implement loaders/mutations** following `createClient` from `@/lib/supabase/server` (callers pass `userId` already authenticated). Map DB `options` jsonb ↔ `QuestionOption[]`. On `submitSession`: for each mcq answer call `gradeMcq`; set `is_correct`; for wrong mcq upsert `wrong_book` (`wrong_count + 1`, `cleared_at = null`); for correct mcq set `cleared_at = now()` if row exists; update session totals + `finished_at`.

- [ ] **Step 2: Smoke-check TypeScript**

Run: `npx tsc --noEmit`  
Expected: no errors in `lib/data/practice.ts`

- [ ] **Step 3: Commit**

```bash
git add lib/data/practice.ts
git commit -m "feat: add practice data access layer"
```

---

### Task 4: Server actions

**Files:**
- Create: `app/practice/actions.ts`

**Interfaces:**
- Consumes: functions from Task 3
- Produces: `startChapterPracticeAction(chapterId)`, `startWrongBookPracticeAction()`, `saveDraftAnswersAction(sessionId, answers)`, `submitPracticeAction(sessionId)`, `selfMarkAction(sessionId, questionId, correct)`, `saveQuestionAction(form)`, `deleteUserQuestionAction(id)`

- [ ] **Step 1: Implement actions** with `"use server"`, auth check, `revalidatePath` for `/practice`, `/practice/wrong`, `/practice/session/[id]`. `startChapterPracticeAction` loads questions for chapter (if empty throw friendly error), creates session, redirects to `/practice/c/[chapterId]?session=...` OR redirect to a dedicated answering route — use `/practice/c/[chapterId]` with session query, or create session then redirect to `/practice/session/[id]/take` .

**Chosen UX routes (lock in):**
- Answering UI: `/practice/c/[chapterId]?session=<id>` for chapter mode; wrong-book answering at `/practice/wrong/take?session=<id>`
- After submit: redirect `/practice/session/[id]`

Implement `app/practice/wrong/take/page.tsx` in Task 6.

- [ ] **Step 2: Commit**

```bash
git add app/practice/actions.ts
git commit -m "feat: add practice server actions"
```

---

### Task 5: PDF map + extract + seed pipeline

**Files:**
- Create: `content/questions/pdf_chapter_map.json`
- Create: `scripts/extract_pdf_text.py`
- Create: `scripts/parse_questions_heuristic.py` (split by 题号 / A.B.C.D patterns; mark `needs_review`)
- Create: `scripts/build_question_seed.py`
- Create: `content/questions/bank/` (output)
- Create: `supabase/migrations/007_questions_seed.sql` (first batch; full corpus in follow-up commits)

**Interfaces:**
- Map entry: `{ "pdf": "逻辑/基础必修2-假言命题.pdf", "chapter_id": "22222222-2222-2222-2222-222222222202" }`
- Bank JSON item:

```json
{
  "id": "33333333-3333-3333-3333-000000000001",
  "chapter_id": "22222222-2222-2222-2222-222222222202",
  "qtype": "mcq",
  "stem": "...",
  "options": [{"key":"A","text":"..."},{"key":"B","text":"..."},{"key":"C","text":"..."},{"key":"D","text":"..."}],
  "answer": "B",
  "explanation": "",
  "source_file": "逻辑/基础必修2-假言命题.pdf",
  "source_page": null,
  "needs_review": true,
  "sort_order": 1
}
```

- [ ] **Step 1: Write `pdf_chapter_map.json`** covering all PDFs under `考研材料/逻辑`, `数学`, `英语2`, `英语写作` mapped to closest existing/new chapter ids.

- [ ] **Step 2: `extract_pdf_text.py`**

```python
# scripts/extract_pdf_text.py
# Usage: python scripts/extract_pdf_text.py
# Requires: pip install pymupdf
from pathlib import Path
import hashlib
import fitz

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "考研材料"
OUT = ROOT / "content" / "questions" / "raw"
OUT.mkdir(parents=True, exist_ok=True)

for pdf in SRC.rglob("*.pdf"):
    rel = pdf.relative_to(SRC).as_posix()
    digest = hashlib.md5(rel.encode("utf-8")).hexdigest()[:10]
    safe = rel.replace("/", "__").replace(" ", "_")
    out = OUT / f"{digest}_{safe}.txt"
    doc = fitz.open(pdf)
    parts = []
    for i, page in enumerate(doc):
        parts.append(f"\n\n--- page {i+1} ---\n")
        parts.append(page.get_text())
    out.write_text("".join(parts), encoding="utf-8")
    print("wrote", out.name)
```

- [ ] **Step 3: Heuristic parser** — scan raw text for patterns like `^\d+[\.、]` stems and `^[A-D][\.、．]` options; default `needs_review=true` when answer not found via `答案[:：]\s*[A-D]`. Write JSON under `content/questions/bank/`.

- [ ] **Step 4: `build_question_seed.py`** reads all bank JSON → emits `007_questions_seed.sql` with `insert ... on conflict (id) do update`.

- [ ] **Step 5: Run extract + parse on machine**

```bash
pip install pymupdf
python scripts/extract_pdf_text.py
python scripts/parse_questions_heuristic.py
python scripts/build_question_seed.py
```

Expected: non-empty `content/questions/raw/`, `bank/`, and `007_questions_seed.sql`. If a PDF yields 0 questions, leave a note in commit message; still keep raw text for later LLM pass.

- [ ] **Step 6: Commit artifacts** (raw txt may be large — prefer committing `bank/*.json` + map + scripts + seed SQL; add `content/questions/raw/` to `.gitignore` if huge)

```bash
git add content/questions scripts supabase/migrations/007_questions_seed.sql .gitignore
git commit -m "feat: add PDF extract pipeline and question seed batch"
```

---

### Task 6: Practice UI pages

**Files:**
- Create: `app/practice/page.tsx`
- Create: `app/practice/c/[chapterId]/page.tsx`
- Create: `app/practice/session/[id]/page.tsx`
- Create: `app/practice/wrong/page.tsx`
- Create: `app/practice/wrong/take/page.tsx`
- Create: `app/practice/new/page.tsx`
- Create: `app/practice/q/[id]/edit/page.tsx`
- Create: `components/practice/PracticeForm.tsx` (client: local state for answers, submit buttons)
- Create: `components/practice/SelfMarkButtons.tsx`
- Modify: `app/globals.css` (practice list/result styles only as needed)

**Interfaces:**
- Consumes: Task 3–4 actions and loaders
- `PracticeForm` props: `{ sessionId: string; questions: Question[]; initialAnswers?: Record<string,string>; mode: "take" | "readonly" }`

- [ ] **Step 1: Hub `/practice`** — list subjects via `listSubjects()`, chapters via existing subject chapter loader, join `listChapterQuestionCounts()`, link to start practice. Show needs_review badge counts. Link to `/practice/wrong` and `/practice/new`.

- [ ] **Step 2: Chapter take page** — on load without session, call `startChapterPracticeAction` (form button「开始练习」). With session: load questions **without sending correct answers to a separate reveal** — stem+options only in take mode; keep `answer`/`explanation` out of client props in take mode (server strips them when passing to `PracticeForm` in take mode).

Security note: strip `answer` and `explanation` from props in take mode.

- [ ] **Step 3: Submit → session result page** — show score, each question with user answer vs correct, explanation; for `short` + not `self_marked`, render `SelfMarkButtons`.

- [ ] **Step 4: Wrong book list + take** — list active wrong questions; button starts `startWrongBookPracticeAction`.

- [ ] **Step 5: New/edit question forms** — fields: chapter select, qtype, stem, options (4 lines for mcq), answer, explanation, needs_review checkbox.

- [ ] **Step 6: Manual UI smoke** — `npm run dev`, login, open `/practice`, start a chapter with seeded questions, submit, self-mark one short if present, confirm wrong book.

- [ ] **Step 7: Commit**

```bash
git add app/practice components/practice app/globals.css
git commit -m "feat: add practice UI, wrong book, and question editors"
```

---

### Task 7: Navigation + deploy docs

**Files:**
- Modify: `components/AppHeader.tsx` — add `<Link href="/practice">练习</Link>`
- Modify: `app/nav/page.tsx` — STUDY or new section card to `/practice` and `/practice/wrong`
- Modify: `app/subjects/[slug]/page.tsx` — link `href={`/practice?subject=${slug}`}` or filter hub
- Modify: `app/page.tsx` — optional secondary button「题库练习」
- Modify: `docs/DEPLOY.md` — add run order: `006_practice_schema.sql`, `006b_math_chapters.sql`, `007_questions_seed.sql`
- Modify: `middleware.ts` if practice paths need explicit allow (usually same auth gate as `/`)

- [ ] **Step 1: Wire links**
- [ ] **Step 2: Update DEPLOY.md**
- [ ] **Step 3: `npm run build`** — expect success
- [ ] **Step 4: Commit + push**

```bash
git add components/AppHeader.tsx app/nav/page.tsx app/subjects/[slug]/page.tsx app/page.tsx docs/DEPLOY.md
git commit -m "feat: wire practice into nav and deploy docs"
git push
```

---

## Spec coverage check

| Spec section | Task |
|--------------|------|
| Success: extract + import | 5 |
| Practice by chapter + submit | 4, 6 |
| MCQ auto / short self-mark | 1, 3, 6 |
| Wrong book | 3, 4, 6 |
| needs_review + edit | 5, 6 |
| Mobile / daylight desk | 6, 7 |
| Schema + RLS | 2 |
| Extra math chapters | 2 |
| No PDF on Vercel | 5 (gitignore raw; no upload) |
| Nav entry | 7 |

## Placeholder / consistency check

- Routes locked: take on `/practice/c/[chapterId]` + `/practice/wrong/take`; results on `/practice/session/[id]`
- Grading only via `gradeMcq` / `computeMcqScore` from `lib/practice.ts`
- Wrong book uses soft clear `cleared_at`
- System question inserts via SQL seed only; app creates with `user_id = auth.uid()`
