"use client";

import { useState } from "react";
import { ChapterSidebar } from "@/components/ChapterSidebar";
import type { Chapter } from "@/lib/types";

type Props = {
  chapters: Chapter[];
  subjectSlug: string;
  activeChapterId: string | null;
};

export function ChapterDrawer({
  chapters,
  subjectSlug,
  activeChapterId,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="chapter-drawer-wrap">
      <button
        type="button"
        className="btn-secondary mobile-only"
        onClick={() => setOpen(true)}
      >
        章节
      </button>
      {open ? (
        <div className="drawer-overlay" onClick={() => setOpen(false)}>
          <div
            className="drawer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-header">
              <strong>选择章节</strong>
              <button
                type="button"
                className="btn-text"
                onClick={() => setOpen(false)}
              >
                关闭
              </button>
            </div>
            <div onClick={() => setOpen(false)}>
              <ChapterSidebar
                chapters={chapters}
                subjectSlug={subjectSlug}
                activeChapterId={activeChapterId}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
