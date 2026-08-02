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
