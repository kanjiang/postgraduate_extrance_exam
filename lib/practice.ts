import type { PracticeAnswer, PracticeSession, QuestionType } from "./types";

export const FINISHED_SESSION_ERROR = "本次练习已提交，不能再修改答案";
export const REVIEW_ONLY_CHAPTER_ERROR = "该章节题目均待校对，暂不可练习";

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

export function assertSessionEditable(
  session: Pick<PracticeSession, "finished_at">,
): void {
  if (session.finished_at) {
    throw new Error(FINISHED_SESSION_ERROR);
  }
}

export function shouldSkipSelfMark(
  answer: Pick<PracticeAnswer, "self_marked">,
): boolean {
  return answer.self_marked;
}

export function filterChapterQuestions<T extends { needs_review: boolean }>(
  questions: T[],
  includeNeedsReview = false,
): T[] {
  if (includeNeedsReview) {
    return questions;
  }
  return questions.filter((question) => !question.needs_review);
}

export function getChapterPracticeAvailability(input: {
  total: number;
  reviewable: number;
}): "empty" | "review_only" | "ready" {
  if (input.total === 0) {
    return "empty";
  }
  if (input.reviewable === 0) {
    return "review_only";
  }
  return "ready";
}
