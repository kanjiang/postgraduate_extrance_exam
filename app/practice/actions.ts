"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  createSession,
  getQuestion,
  listActiveWrongQuestions,
  listQuestionsForChapter,
  saveAnswers,
  selfMarkAnswer,
  submitSession,
  upsertQuestion,
} from "@/lib/data/practice";

type SaveQuestionForm = Omit<Parameters<typeof upsertQuestion>[0], "userId">;

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("未登录");
  return { supabase, user };
}

function revalidatePracticeRoutes(sessionId?: string, chapterId?: string | null) {
  revalidatePath("/practice");
  revalidatePath("/practice/wrong");
  if (chapterId) {
    revalidatePath(`/practice/c/${chapterId}`);
  }
  if (sessionId) {
    revalidatePath(`/practice/session/${sessionId}`);
  }
}

export async function startChapterPracticeAction(chapterId: string) {
  const { user } = await requireUser();
  const questions = await listQuestionsForChapter(chapterId);
  if (questions.length === 0) {
    throw new Error("该章节还没有可练习的题目");
  }

  const sessionId = await createSession(user.id, {
    mode: "chapter",
    chapterId,
    questionIds: questions.map((question) => question.id),
  });
  revalidatePracticeRoutes(sessionId, chapterId);
  redirect(`/practice/c/${chapterId}?session=${sessionId}`);
}

export async function startWrongBookPracticeAction() {
  const { user } = await requireUser();
  const questions = await listActiveWrongQuestions(user.id);
  if (questions.length === 0) {
    throw new Error("错题本里还没有可练习的题目");
  }

  const sessionId = await createSession(user.id, {
    mode: "wrong_book",
    chapterId: null,
    questionIds: questions.map((question) => question.id),
  });
  revalidatePracticeRoutes(sessionId);
  revalidatePath("/practice/wrong/take");
  redirect(`/practice/wrong/take?session=${sessionId}`);
}

export async function saveDraftAnswersAction(
  sessionId: string,
  answers: { questionId: string; userAnswer: string }[],
) {
  await requireUser();
  await saveAnswers(sessionId, answers);
  revalidatePracticeRoutes(sessionId);
  revalidatePath("/practice/wrong/take");
}

export async function submitPracticeAction(sessionId: string) {
  const { user } = await requireUser();
  await submitSession(sessionId, user.id);
  revalidatePracticeRoutes(sessionId);
  revalidatePath("/practice/wrong/take");
  redirect(`/practice/session/${sessionId}`);
}

export async function selfMarkAction(
  sessionId: string,
  questionId: string,
  correct: boolean,
) {
  const { user } = await requireUser();
  await selfMarkAnswer(sessionId, questionId, correct, user.id);
  revalidatePracticeRoutes(sessionId);
  revalidatePath("/practice/wrong/take");
}

export async function saveQuestionAction(form: SaveQuestionForm) {
  const { user } = await requireUser();
  const questionId = await upsertQuestion({ ...form, userId: user.id });
  revalidatePracticeRoutes(undefined, form.chapterId);
  return questionId;
}

export async function deleteUserQuestionAction(id: string) {
  const { supabase, user } = await requireUser();
  const question = await getQuestion(id);
  if (!question) {
    throw new Error("题目不存在");
  }
  if (question.user_id !== user.id) {
    throw new Error("无权删除该题目");
  }

  const { error } = await supabase
    .from("questions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw error;

  revalidatePracticeRoutes(undefined, question.chapter_id);
}
