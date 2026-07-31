"use client";

import { useTransition } from "react";
import { toggleStarAction } from "@/app/points/actions";

export function StarButton({
  pointId,
  starred,
}: {
  pointId: string;
  starred: boolean;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className="chip"
      disabled={pending}
      onClick={() => start(() => toggleStarAction(pointId))}
    >
      {starred ? "★ 已收藏" : "☆ 收藏"}
    </button>
  );
}
