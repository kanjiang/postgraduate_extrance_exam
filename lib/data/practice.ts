import {
  assertSessionEditable,
  filterChapterQuestions,
  gradeMcq,
  shouldSkipSelfMark,
} from "@/lib/practice";
import { createClient } from "@/lib/supabase/server";
import type {
  PracticeAnswer,
  PracticeMode,
  PracticeSession,
  Question,
  QuestionOption,
  WrongBookEntry,
} from "@/lib/types";

type QuestionRow = Omit<Question, "options"> & { options: unknown };

type SessionStats = Pick<
  PracticeSession,
  "mcq_correct" | "mcq_total" | "short_marked_correct" | "short_total"
>;

const QUESTION_SELECT =
  "id, chapter_id, qtype, stem, options, answer, explanation, source_file, source_page, needs_review, sort_order, user_id";
const SESSION_SELECT =
  "id, user_id, chapter_id, mode, started_at, finished_at, mcq_correct, mcq_total, short_marked_correct, short_total";

function normalizeOptions(options: unknown): QuestionOption[] | null {
  if (!Array.isArray(options)) return null;
  const mapped = options
    .map((option) => {
      if (!option || typeof option !== "object") return null;
      const key = (option as { key?: unknown }).key;
      const text = (option as { text?: unknown }).text;
      if (typeof key !== "string" || typeof text !== "string") return null;
      return { key, text };
    })
    .filter((option): option is QuestionOption => option != null);
  return mapped.length > 0 ? mapped : null;
}

function toQuestion(row: QuestionRow): Question {
  return {
    ...row,
    options: normalizeOptions(row.options),
  };
}

function toQuestionRows(rows: QuestionRow[]): Question[] {
  return rows.map((row) => toQuestion(row));
}

function computeSessionStats(
  rows: Array<PracticeAnswer & { qtype: Question["qtype"] }>,
): SessionStats {
  const mcqRows = rows.filter((row) => row.qtype === "mcq");
  const shortRows = rows.filter((row) => row.qtype === "short");
  return {
    mcq_total: mcqRows.length,
    mcq_correct: mcqRows.filter((row) => row.is_correct === true).length,
    short_total: shortRows.length,
    short_marked_correct: shortRows.filter(
      (row) => row.self_marked && row.is_correct === true,
    ).length,
  };
}

async function getQuestionMap(questionIds: string[]): Promise<Map<string, Question>> {
  if (questionIds.length === 0) return new Map();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questions")
    .select(QUESTION_SELECT)
    .in("id", questionIds);
  if (error) throw error;

  const map = new Map<string, Question>();
  for (const row of (data ?? []) as QuestionRow[]) {
    map.set(row.id, toQuestion(row));
  }
  return map;
}

async function getSessionOrThrow(sessionId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practice_sessions")
    .select(SESSION_SELECT)
    .eq("id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("练习会话不存在");
  return data as PracticeSession;
}

async function getSessionAnswers(sessionId: string): Promise<PracticeAnswer[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practice_answers")
    .select("session_id, question_id, user_answer, is_correct, self_marked")
    .eq("session_id", sessionId);
  if (error) throw error;
  return (data ?? []) as PracticeAnswer[];
}

async function syncWrongBookEntry(input: {
  userId: string;
  questionId: string;
  correct: boolean;
  existing?: WrongBookEntry | null;
}): Promise<void> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  if (input.correct) {
    if (!input.existing) return;
    const { error } = await supabase
      .from("wrong_book")
      .update({ cleared_at: now })
      .eq("user_id", input.userId)
      .eq("question_id", input.questionId);
    if (error) throw error;
    return;
  }

  if (input.existing) {
    const { error } = await supabase
      .from("wrong_book")
      .update({
        wrong_count: input.existing.wrong_count + 1,
        last_wrong_at: now,
        cleared_at: null,
      })
      .eq("user_id", input.userId)
      .eq("question_id", input.questionId);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("wrong_book").insert({
    user_id: input.userId,
    question_id: input.questionId,
    wrong_count: 1,
    last_wrong_at: now,
    cleared_at: null,
  });
  if (error) throw error;
}

async function refreshSessionTotals(sessionId: string): Promise<void> {
  const answers = await getSessionAnswers(sessionId);
  if (answers.length === 0) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("practice_sessions")
      .update({
        mcq_correct: 0,
        mcq_total: 0,
        short_marked_correct: 0,
        short_total: 0,
      })
      .eq("id", sessionId);
    if (error) throw error;
    return;
  }

  const questions = await getQuestionMap(answers.map((answer) => answer.question_id));
  const rows = answers
    .map((answer) => {
      const question = questions.get(answer.question_id);
      if (!question) return null;
      return { ...answer, qtype: question.qtype };
    })
    .filter(
      (row): row is PracticeAnswer & { qtype: Question["qtype"] } => row != null,
    );
  const stats = computeSessionStats(rows);
  const supabase = await createClient();
  const { error } = await supabase
    .from("practice_sessions")
    .update(stats)
    .eq("id", sessionId);
  if (error) throw error;
}

export async function listChapterQuestionCounts(): Promise<
  { chapter_id: string; total: number; needs_review: number }[]
> {
  const supabase = await createClient();
  const [{ data: chapters, error: chapterError }, { data: questions, error: questionError }] =
    await Promise.all([
      supabase.from("chapters").select("id, sort_order"),
      supabase.from("questions").select("chapter_id, needs_review"),
    ]);
  if (chapterError) throw chapterError;
  if (questionError) throw questionError;

  const counts = new Map<string, { total: number; needs_review: number }>();
  for (const chapter of [...(chapters ?? [])].sort((a, b) => {
    const left = (a as { sort_order?: number }).sort_order ?? 0;
    const right = (b as { sort_order?: number }).sort_order ?? 0;
    return left - right || String((a as { id?: string }).id).localeCompare(String((b as { id?: string }).id));
  })) {
    counts.set(chapter.id as string, { total: 0, needs_review: 0 });
  }
  for (const row of (questions ?? []) as Array<{
    chapter_id: string;
    needs_review: boolean;
  }>) {
    const entry = counts.get(row.chapter_id) ?? { total: 0, needs_review: 0 };
    entry.total += 1;
    if (row.needs_review) entry.needs_review += 1;
    counts.set(row.chapter_id, entry);
  }

  return [...counts.entries()]
    .map(([chapter_id, value]) => ({
      chapter_id,
      total: value.total,
      needs_review: value.needs_review,
    }))
    ;
}

export async function listQuestionsForChapter(
  chapterId: string,
  includeNeedsReview = false,
): Promise<Question[]> {
  const supabase = await createClient();
  let query = supabase
    .from("questions")
    .select(QUESTION_SELECT)
    .eq("chapter_id", chapterId);
  if (!includeNeedsReview) {
    query = query.eq("needs_review", false);
  }
  const { data, error } = await query.order("sort_order");
  if (error) throw error;
  return filterChapterQuestions(
    toQuestionRows((data ?? []) as QuestionRow[]),
    includeNeedsReview,
  );
}

export async function findOpenChapterSession(
  userId: string,
  chapterId: string,
): Promise<PracticeSession | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practice_sessions")
    .select(SESSION_SELECT)
    .eq("user_id", userId)
    .eq("mode", "chapter")
    .eq("chapter_id", chapterId)
    .is("finished_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as PracticeSession | null) ?? null;
}

export async function listActiveWrongQuestions(userId: string): Promise<Question[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wrong_book")
    .select("question_id, wrong_count, last_wrong_at, cleared_at")
    .eq("user_id", userId)
    .is("cleared_at", null);
  if (error) throw error;

  const questionIds = [...new Set((data ?? []).map((row) => row.question_id as string))];
  const questions = await getQuestionMap(questionIds);
  return questionIds
    .map((questionId) => questions.get(questionId))
    .filter((question): question is Question => question != null);
}

export async function getQuestion(id: string): Promise<Question | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questions")
    .select(QUESTION_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toQuestion(data as QuestionRow) : null;
}

export async function upsertQuestion(input: {
  userId: string;
  id?: string | null;
  chapterId: string;
  qtype: Question["qtype"];
  stem: string;
  options?: QuestionOption[] | null;
  answer: string;
  explanation: string;
  sourceFile?: string | null;
  sourcePage?: number | null;
  needsReview?: boolean;
  sortOrder?: number;
}): Promise<string> {
  const existing = input.id ? await getQuestion(input.id) : null;
  if (existing && existing.user_id != null && existing.user_id !== input.userId) {
    throw new Error("无权编辑该题目");
  }

  const options =
    input.qtype === "mcq"
      ? input.options ?? existing?.options ?? null
      : null;
  if (input.qtype === "mcq" && !options) {
    throw new Error("选择题需要选项");
  }

  const row = {
    chapter_id: input.chapterId,
    qtype: input.qtype,
    stem: input.stem,
    options: input.qtype === "mcq" ? options : null,
    answer: input.answer,
    explanation: input.explanation,
    source_file:
      input.sourceFile !== undefined
        ? input.sourceFile
        : existing?.source_file ?? null,
    source_page:
      input.sourcePage !== undefined
        ? input.sourcePage
        : existing?.source_page ?? null,
    needs_review: input.needsReview ?? existing?.needs_review ?? false,
    sort_order: input.sortOrder ?? existing?.sort_order ?? 0,
    user_id: existing ? existing.user_id : input.userId,
  };
  const questionId = input.id ?? existing?.id ?? null;

  const supabase = await createClient();
  const query = questionId
    ? supabase.from("questions").upsert({ ...row, id: questionId }, { onConflict: "id" })
    : supabase.from("questions").insert({
        ...row,
        user_id: input.userId,
      });
  const { data, error } = await query.select("id").single();
  if (error) throw error;
  return data.id as string;
}

export async function createSession(
  userId: string,
  input: {
    mode: PracticeMode;
    chapterId: string | null;
    questionIds: string[];
  },
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("practice_sessions")
    .insert({
      user_id: userId,
      chapter_id: input.chapterId,
      mode: input.mode,
    })
    .select("id")
    .single();
  if (error) throw error;

  const questionIds = [...new Set(input.questionIds)];
  if (questionIds.length > 0) {
    const { error: answersError } = await supabase.from("practice_answers").insert(
      questionIds.map((questionId) => ({
        session_id: data.id,
        question_id: questionId,
        user_answer: "",
        is_correct: null,
        self_marked: false,
      })),
    );
    if (answersError) throw answersError;
  }

  return data.id as string;
}

export async function saveAnswers(
  sessionId: string,
  answers: { questionId: string; userAnswer: string }[],
  userId: string,
): Promise<void> {
  const session = await getSessionOrThrow(sessionId, userId);
  assertSessionEditable(session);

  const supabase = await createClient();
  const rows = [...new Map(answers.map((answer) => [answer.questionId, answer])).values()];
  if (rows.length === 0) return;

  const { error } = await supabase.from("practice_answers").upsert(
    rows.map((answer) => ({
      session_id: sessionId,
      question_id: answer.questionId,
      user_answer: answer.userAnswer,
    })),
    { onConflict: "session_id,question_id" },
  );
  if (error) throw error;
}

export async function submitSession(
  sessionId: string,
  userId: string,
): Promise<PracticeSession> {
  const session = await getSessionOrThrow(sessionId, userId);
  if (session.finished_at) {
    return session;
  }

  const answers = await getSessionAnswers(sessionId);
  const questions = await getQuestionMap(answers.map((answer) => answer.question_id));
  const rows = answers
    .map((answer) => {
      const question = questions.get(answer.question_id);
      if (!question) return null;
      return { ...answer, qtype: question.qtype, correctAnswer: question.answer };
    })
    .filter(
      (
        row,
      ): row is PracticeAnswer & {
        qtype: Question["qtype"];
        correctAnswer: string;
      } => row != null,
    );

  const supabase = await createClient();
  const mcqUpdates = rows
    .filter((row) => row.qtype === "mcq")
    .map((row) => {
      const isCorrect = gradeMcq(row.user_answer, row.correctAnswer);
      return {
        session_id: row.session_id,
        question_id: row.question_id,
        user_answer: row.user_answer,
        is_correct: isCorrect,
        self_marked: row.self_marked,
      };
    });

  if (mcqUpdates.length > 0) {
    const { error } = await supabase
      .from("practice_answers")
      .upsert(mcqUpdates, { onConflict: "session_id,question_id" });
    if (error) throw error;
    const wrongRows = await supabase
      .from("wrong_book")
      .select("user_id, question_id, wrong_count, last_wrong_at, cleared_at")
      .eq("user_id", userId)
      .in(
        "question_id",
        mcqUpdates.map((row) => row.question_id),
      );
    if (wrongRows.error) throw wrongRows.error;
    const wrongMap = new Map(
      (wrongRows.data ?? []).map((row) => [row.question_id as string, row as WrongBookEntry]),
    );

    for (const row of mcqUpdates) {
      const question = questions.get(row.question_id);
      if (!question) continue;
      const existing = wrongMap.get(row.question_id) ?? null;
      await syncWrongBookEntry({
        userId,
        questionId: row.question_id,
        correct: row.is_correct === true,
        existing,
      });
    }
  }

  const stats = computeSessionStats(rows.map((row) => ({
    ...row,
    is_correct:
      row.qtype === "mcq"
        ? mcqUpdates.find((item) => item.question_id === row.question_id)?.is_correct ??
          row.is_correct
        : row.is_correct,
  })));

  const { error: sessionError } = await supabase
    .from("practice_sessions")
    .update({
      ...stats,
      finished_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .eq("user_id", userId);
  if (sessionError) throw sessionError;

  const { data: updatedSession, error: fetchError } = await supabase
    .from("practice_sessions")
    .select(SESSION_SELECT)
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single();
  if (fetchError) throw fetchError;
  return updatedSession as PracticeSession;
}

export async function selfMarkAnswer(
  sessionId: string,
  questionId: string,
  correct: boolean,
  userId: string,
): Promise<void> {
  await getSessionOrThrow(sessionId, userId);

  const supabase = await createClient();
  const { data: question, error: questionError } = await supabase
    .from("questions")
    .select("id, qtype, answer")
    .eq("id", questionId)
    .maybeSingle();
  if (questionError) throw questionError;
  if (!question) throw new Error("题目不存在");
  if ((question as { qtype: Question["qtype"] }).qtype !== "short") {
    throw new Error("仅简答题支持手动判分");
  }

  const { data: existingAnswer, error: existingAnswerError } = await supabase
    .from("practice_answers")
    .select("session_id, question_id, user_answer, is_correct, self_marked")
    .eq("session_id", sessionId)
    .eq("question_id", questionId)
    .maybeSingle();
  if (existingAnswerError) throw existingAnswerError;
  if (!existingAnswer) throw new Error("作答记录不存在");
  if (shouldSkipSelfMark(existingAnswer as PracticeAnswer)) {
    return;
  }

  const { error: answerError } = await supabase
    .from("practice_answers")
    .update({ is_correct: correct, self_marked: true })
    .eq("session_id", sessionId)
    .eq("question_id", questionId);
  if (answerError) throw answerError;

  const existingWrong = await supabase
    .from("wrong_book")
    .select("user_id, question_id, wrong_count, last_wrong_at, cleared_at")
    .eq("user_id", userId)
    .eq("question_id", questionId)
    .maybeSingle();
  if (existingWrong.error) throw existingWrong.error;

  await syncWrongBookEntry({
    userId,
    questionId,
    correct,
    existing: (existingWrong.data ?? null) as WrongBookEntry | null,
  });

  await refreshSessionTotals(sessionId);
}

export async function getSessionBundle(
  sessionId: string,
  userId: string,
): Promise<{
  session: PracticeSession;
  answers: PracticeAnswer[];
  questions: Question[];
}> {
  const session = await getSessionOrThrow(sessionId, userId);
  const answers = await getSessionAnswers(sessionId);
  const questionMap = await getQuestionMap(answers.map((answer) => answer.question_id));
  const questions = answers
    .map((answer) => questionMap.get(answer.question_id))
    .filter((question): question is Question => question != null);
  return { session, answers, questions };
}
