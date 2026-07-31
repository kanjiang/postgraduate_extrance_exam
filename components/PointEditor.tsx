"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { savePointAction } from "@/app/points/actions";
import { MarkdownBody } from "@/components/MarkdownBody";

type Props = {
  pointId?: string;
  chapterId?: string;
  initialTitle?: string;
  initialBody?: string;
};

export function PointEditor({
  pointId,
  chapterId,
  initialTitle = "",
  initialBody = "",
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    if (pointId) fd.set("pointId", pointId);
    if (chapterId) fd.set("chapterId", chapterId);
    fd.set("title", title);
    fd.set("body_md", body);
    start(async () => {
      try {
        const id = await savePointAction(fd);
        router.push(`/points/${id}`);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "保存失败");
      }
    });
  }

  return (
    <form className="point-editor" onSubmit={onSubmit}>
      <label>
        标题
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <div className="editor-tabs">
        <button
          type="button"
          className={tab === "edit" ? "chip active" : "chip"}
          onClick={() => setTab("edit")}
        >
          编辑
        </button>
        <button
          type="button"
          className={tab === "preview" ? "chip active" : "chip"}
          onClick={() => setTab("preview")}
        >
          预览
        </button>
      </div>
      {tab === "edit" ? (
        <label>
          正文（Markdown）
          <textarea
            rows={16}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </label>
      ) : (
        <MarkdownBody content={body || "_暂无内容_"} />
      )}
      {error ? <p className="form-error">{error}</p> : null}
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "保存中…" : "保存"}
      </button>
    </form>
  );
}
