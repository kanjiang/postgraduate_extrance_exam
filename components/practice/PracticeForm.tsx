"use client";

import { useMemo, useState, useTransition } from "react";
import {
  saveDraftAnswersAction,
  submitPracticeAction,
} from "@/app/practice/actions";
import type { Question } from "@/lib/types";

type PracticeQuestion = Omit<Question, "answer" | "explanation"> &
  Partial<Pick<Question, "answer" | "explanation">>;

type Props = {
  sessionId: string;
  questions: PracticeQuestion[];
  initialAnswers?: Record<string, string>;
  mode: "take" | "readonly";
};

function buildAnswerPayload(answers: Record<string, string>) {
  return Object.entries(answers).map(([questionId, userAnswer]) => ({
    questionId,
    userAnswer,
  }));
}

export function PracticeForm({
  sessionId,
  questions,
  initialAnswers = {},
  mode,
}: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const next: Record<string, string> = {};
    for (const question of questions) {
      next[question.id] = initialAnswers[question.id] ?? "";
    }
    return next;
  });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const answeredCount = useMemo(
    () =>
      questions.filter((question) => (answers[question.id] ?? "").trim() !== "")
        .length,
    [answers, questions],
  );

  function updateAnswer(questionId: string, value: string) {
    setAnswers((current) => ({
      ...current,
      [questionId]: value,
    }));
  }

  function saveDraft() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      try {
        await saveDraftAnswersAction(sessionId, buildAnswerPayload(answers));
        setMessage("草稿已保存");
      } catch (err) {
        setError(err instanceof Error ? err.message : "保存草稿失败");
      }
    });
  }

  function submitAnswers() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      try {
        await saveDraftAnswersAction(sessionId, buildAnswerPayload(answers));
      } catch (err) {
        setError(err instanceof Error ? err.message : "提交前保存失败");
        return;
      }
      await submitPracticeAction(sessionId);
    });
  }

  return (
    <div className="practice-form-wrap">
      <div className="practice-form-meta">
        <p className="muted">
          共 {questions.length} 题，已作答 {answeredCount} 题
        </p>
        {mode === "take" ? (
          <p className="muted">可先保存草稿，再统一提交评分。</p>
        ) : (
          <p className="muted">本页为只读模式。</p>
        )}
      </div>

      <ol className="practice-question-list">
        {questions.map((question, index) => (
          <li key={question.id} className="practice-question-card">
            <div className="practice-question-head">
              <strong>
                第 {index + 1} 题 ·
                {question.qtype === "mcq" ? " 选择题" : " 简答题"}
              </strong>
            </div>
            <p className="practice-stem">{question.stem}</p>

            {question.qtype === "mcq" ? (
              <div className="practice-options">
                {(question.options ?? []).map((option) => (
                  <label key={option.key} className="practice-option">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.key}
                      checked={answers[question.id] === option.key}
                      onChange={(event) =>
                        updateAnswer(question.id, event.target.value)
                      }
                      disabled={mode !== "take" || pending}
                    />
                    <span>
                      {option.key}. {option.text}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <label className="practice-answer-block">
                <span className="muted">你的作答</span>
                <textarea
                  rows={6}
                  value={answers[question.id] ?? ""}
                  onChange={(event) =>
                    updateAnswer(question.id, event.target.value)
                  }
                  disabled={mode !== "take" || pending}
                  placeholder="输入你的答案"
                />
              </label>
            )}
          </li>
        ))}
      </ol>

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="practice-inline-message">{message}</p> : null}

      {mode === "take" ? (
        <div className="practice-form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={saveDraft}
            disabled={pending}
          >
            {pending ? "处理中…" : "保存草稿"}
          </button>
          <button
            type="button"
            className="btn-primary practice-submit-button"
            onClick={submitAnswers}
            disabled={pending}
          >
            {pending ? "提交中…" : "完成并评分"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
