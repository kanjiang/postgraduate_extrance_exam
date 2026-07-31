"use client";

import { useTransition } from "react";
import { cycleMasteryAction } from "@/app/points/actions";
import type { Mastery } from "@/lib/types";

const label: Record<Mastery, string> = {
  unlearned: "未学",
  fuzzy: "模糊",
  mastered: "掌握",
};

export function MasteryControl({
  pointId,
  mastery,
}: {
  pointId: string;
  mastery: Mastery;
}) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className="chip"
      disabled={pending}
      onClick={() => start(() => cycleMasteryAction(pointId))}
    >
      掌握度：{label[mastery]}
    </button>
  );
}
