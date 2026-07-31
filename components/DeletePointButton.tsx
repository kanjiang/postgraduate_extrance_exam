"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePointAction } from "@/app/points/actions";

export function DeletePointButton({
  pointId,
  subjectSlug,
}: {
  pointId: string;
  subjectSlug: string | null;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      className="btn-danger"
      disabled={pending}
      onClick={() => {
        if (!confirm("确认删除该知识点？")) return;
        start(async () => {
          await deletePointAction(pointId);
          router.push(subjectSlug ? `/subjects/${subjectSlug}` : "/");
          router.refresh();
        });
      }}
    >
      删除
    </button>
  );
}
