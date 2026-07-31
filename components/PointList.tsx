import Link from "next/link";
import type { ResolvedPoint } from "@/lib/types";

const masteryLabel = {
  unlearned: "未学",
  fuzzy: "模糊",
  mastered: "掌握",
} as const;

export function PointList({ points }: { points: ResolvedPoint[] }) {
  if (points.length === 0) {
    return <p className="muted">本章暂无知识点。</p>;
  }

  return (
    <ul className="point-list">
      {points.map((p) => (
        <li key={p.id}>
          <Link href={`/points/${p.id}`} className="point-row">
            <span className="point-row-title">{p.title}</span>
            <span className="point-row-meta">
              {p.starred ? "★ " : ""}
              {masteryLabel[p.mastery]}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
