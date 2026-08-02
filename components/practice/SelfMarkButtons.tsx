"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { selfMarkAction } from "@/app/practice/actions";

type Props = {
  sessionId: string;
  questionId: string;
};

export function SelfMarkButtons({ sessionId, questionId }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleMark(correct: boolean) {
    setError(null);
    startTransition(async () => {
      try {
        await selfMarkAction(sessionId, questionId, correct);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "判分失败");
      }
    });
  }

  return (
    <div className="self-mark-box">
      <p className="muted">这道简答题需要你自己判分：</p>
      <div className="self-mark-actions">
        <button
          type="button"
          className="btn-secondary"
          disabled={pending}
          onClick={() => handleMark(true)}
        >
          判定答对
        </button>
        <button
          type="button"
          className="btn-danger"
          disabled={pending}
          onClick={() => handleMark(false)}
        >
          判定答错
        </button>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
