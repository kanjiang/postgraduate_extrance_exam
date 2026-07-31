import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { ChapterDrawer } from "@/components/ChapterDrawer";
import { ChapterSidebar } from "@/components/ChapterSidebar";
import { PointList } from "@/components/PointList";
import { listPointsForChapter } from "@/lib/data/points";
import {
  getSubjectBySlug,
  listChaptersForSubject,
} from "@/lib/data/subjects";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ chapter?: string }>;
};

export default async function SubjectPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { chapter: chapterParam } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const subject = await getSubjectBySlug(slug);
  if (!subject) notFound();

  const chapters = await listChaptersForSubject(subject.id);
  const activeChapterId =
    chapterParam && chapters.some((c) => c.id === chapterParam)
      ? chapterParam
      : (chapters[0]?.id ?? null);

  const points = activeChapterId
    ? await listPointsForChapter(activeChapterId, user.id)
    : [];

  const activeChapter = chapters.find((c) => c.id === activeChapterId);

  return (
    <>
      <AppHeader />
      <main className="page">
        <div className="subject-top">
          <div>
            <p className="breadcrumb">
              <Link href="/">首页</Link> / {subject.name}
            </p>
            <h1>{subject.name}</h1>
          </div>
          <ChapterDrawer
            chapters={chapters}
            subjectSlug={subject.slug}
            activeChapterId={activeChapterId}
          />
        </div>

        <div className="subject-layout">
          <ChapterSidebar
            className="desktop-only"
            chapters={chapters}
            subjectSlug={subject.slug}
            activeChapterId={activeChapterId}
          />
          <section className="subject-main">
            <div className="subject-main-head">
              <h2>{activeChapter?.title ?? "请选择章节"}</h2>
              {activeChapterId ? (
                <Link
                  className="btn-secondary"
                  href={`/points/new?chapter=${activeChapterId}`}
                >
                  新建知识点
                </Link>
              ) : null}
            </div>
            <PointList points={points} />
          </section>
        </div>
      </main>
    </>
  );
}
