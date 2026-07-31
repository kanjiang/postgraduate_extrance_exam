import Link from "next/link";
import type { Chapter } from "@/lib/types";

type Props = {
  chapters: Chapter[];
  subjectSlug: string;
  activeChapterId: string | null;
  className?: string;
};

export function ChapterSidebar({
  chapters,
  subjectSlug,
  activeChapterId,
  className = "",
}: Props) {
  return (
    <aside className={`chapter-sidebar ${className}`}>
      <ul className="chapter-list">
        {chapters.map((ch) => {
          const active = ch.id === activeChapterId;
          return (
            <li key={ch.id}>
              <Link
                href={`/subjects/${subjectSlug}?chapter=${ch.id}`}
                className={active ? "chapter-link active" : "chapter-link"}
              >
                {ch.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
