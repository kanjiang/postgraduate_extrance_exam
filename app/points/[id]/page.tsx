import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { DeletePointButton } from "@/components/DeletePointButton";
import { MarkdownBody } from "@/components/MarkdownBody";
import { MasteryControl } from "@/components/MasteryControl";
import { StarButton } from "@/components/StarButton";
import {
  getChapterSubjectSlug,
  getPointRaw,
  getResolvedPoint,
} from "@/lib/data/points";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export default async function PointPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const point = await getResolvedPoint(id, user.id);
  if (!point) notFound();

  const raw = await getPointRaw(id);
  const subjectSlug = await getChapterSubjectSlug(point.chapter_id);

  return (
    <>
      <AppHeader />
      <main className="page narrow">
        <p className="breadcrumb">
          {subjectSlug ? (
            <Link href={`/subjects/${subjectSlug}`}>返回科目</Link>
          ) : (
            <Link href="/">首页</Link>
          )}
        </p>
        <h1>{point.title}</h1>
        <div className="point-actions">
          <MasteryControl pointId={point.id} mastery={point.mastery} />
          <StarButton pointId={point.id} starred={point.starred} />
          <Link className="chip" href={`/points/${point.id}/edit`}>
            编辑
          </Link>
          {point.isUserOwned ? (
            <DeletePointButton pointId={point.id} subjectSlug={subjectSlug} />
          ) : null}
        </div>
        <MarkdownBody content={point.body_md || "_暂无正文_"} />
        {raw?.user_id == null ? (
          <p className="muted tip">
            这是系统骨架内容。编辑后只会保存到你的账号，不会改动模板。
          </p>
        ) : null}
      </main>
    </>
  );
}
