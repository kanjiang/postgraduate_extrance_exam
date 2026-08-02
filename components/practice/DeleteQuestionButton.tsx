"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteUserQuestionAction } from "@/app/practice/actions";

type Props = {
  questionId: string;
};

export function DeleteQuestionButton({ questionId }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn-danger"
      disabled={pending}
      onClick={() => {
        if (!confirm("确认删除这道题吗？")) return;
        startTransition(async () => {
          await deleteUserQuestionAction(questionId);
          router.push("/practice");
          router.refresh();
        });
      }}
    >
      {pending ? "删除中…" : "删除题目"}
    </button>
  );
}
