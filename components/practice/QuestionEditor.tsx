"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveQuestionAction } from "@/app/practice/actions";
import { DeleteQuestionButton } from "@/components/practice/DeleteQuestionButton";
import type { Question, QuestionOption, QuestionType } from "@/lib/types";

type ChapterChoice = {
  id: string;
  label: string;
};

type Props = {
  chapters: ChapterChoice[];
  initialQuestion?: Question;
  canDelete?: boolean;
};

function optionsToText(options: QuestionOption[] | null): string {
  if (!options?.length) return "";
  return options.map((option) => option.text).join("\n");
}

function normalizeOptionLine(line: string): string {
  return line.replace(/^[A-Da-d][.、:\s)\-]+/, "").trim();
}

function parseOptions(text: string): QuestionOption[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => normalizeOptionLine(line))
    .filter(Boolean);
  if (lines.length !== 4) {
    throw new Error("选择题请填写 4 行选项");
  }
  return lines.map((option, index) => ({
    key: ["A", "B", "C", "D"][index] ?? String(index + 1),
    text: option,
  }));
}

function normalizeMcqAnswer(value: string): string {
  return value.trim().toUpperCase();
}

export function QuestionEditor({
  chapters,
  initialQuestion,
  canDelete = false,
}: Props) {
  const router = useRouter();
  const [chapterId, setChapterId] = useState(
    initialQuestion?.chapter_id ?? chapters[0]?.id ?? "",
  );
  const [qtype, setQtype] = useState<QuestionType>(
    initialQuestion?.qtype ?? "mcq",
  );
  const [stem, setStem] = useState(initialQuestion?.stem ?? "");
  const [optionsText, setOptionsText] = useState(
    optionsToText(initialQuestion?.options ?? null),
  );
  const [answer, setAnswer] = useState(initialQuestion?.answer ?? "");
  const [explanation, setExplanation] = useState(
    initialQuestion?.explanation ?? "",
  );
  const [needsReview, setNeedsReview] = useState(
    initialQuestion?.needs_review ?? false,
  );
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const chapterHelp = useMemo(() => {
    if (chapters.length > 0) return null;
    return "当前没有可用章节，请先准备章节数据。";
  }, [chapters.length]);

  function submit() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      try {
        if (!chapterId) {
          throw new Error("请选择章节");
        }
        const payload = {
          id: initialQuestion?.id,
          chapterId,
          qtype,
          stem: stem.trim(),
          options: qtype === "mcq" ? parseOptions(optionsText) : null,
          answer:
            qtype === "mcq" ? normalizeMcqAnswer(answer) : answer.trim(),
          explanation: explanation.trim(),
          needsReview,
        };
        if (!payload.stem) {
          throw new Error("题干不能为空");
        }
        if (!payload.answer) {
          throw new Error("答案不能为空");
        }
        if (qtype === "mcq" && !/^[A-D]$/.test(payload.answer)) {
          throw new Error("选择题答案请填写 A 到 D");
        }

        const questionId = await saveQuestionAction(payload);
        setMessage("已保存");
        if (!initialQuestion?.id) {
          router.push(`/practice/q/${questionId}/edit`);
        } else {
          router.refresh();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "保存失败");
      }
    });
  }

  return (
    <div className="question-editor">
      <label>
        章节
        <select
          value={chapterId}
          onChange={(event) => setChapterId(event.target.value)}
          disabled={pending || chapters.length === 0}
        >
          {chapters.map((chapter) => (
            <option key={chapter.id} value={chapter.id}>
              {chapter.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        题型
        <select
          value={qtype}
          onChange={(event) => setQtype(event.target.value as QuestionType)}
          disabled={pending}
        >
          <option value="mcq">选择题</option>
          <option value="short">简答题</option>
        </select>
      </label>

      <label>
        题干
        <textarea
          rows={6}
          value={stem}
          onChange={(event) => setStem(event.target.value)}
          disabled={pending}
        />
      </label>

      {qtype === "mcq" ? (
        <label>
          选项（4 行，对应 A-D）
          <textarea
            rows={6}
            value={optionsText}
            onChange={(event) => setOptionsText(event.target.value)}
            disabled={pending}
            placeholder={"选项一\n选项二\n选项三\n选项四"}
          />
        </label>
      ) : null}

      <label>
        答案
        <input
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={pending}
          placeholder={qtype === "mcq" ? "例如 A" : "填写参考答案"}
        />
      </label>

      <label>
        解析
        <textarea
          rows={6}
          value={explanation}
          onChange={(event) => setExplanation(event.target.value)}
          disabled={pending}
        />
      </label>

      <label className="question-editor-check">
        <input
          type="checkbox"
          checked={needsReview}
          onChange={(event) => setNeedsReview(event.target.checked)}
          disabled={pending}
        />
        <span>标记为需要复核</span>
      </label>

      {chapterHelp ? <p className="muted">{chapterHelp}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="practice-inline-message">{message}</p> : null}

      <div className="practice-form-actions">
        <button
          type="button"
          className="btn-primary practice-submit-button"
          onClick={submit}
          disabled={pending || chapters.length === 0}
        >
          {pending ? "保存中…" : "保存题目"}
        </button>
        {initialQuestion?.id && canDelete ? (
          <DeleteQuestionButton questionId={initialQuestion.id} />
        ) : null}
      </div>
    </div>
  );
}
