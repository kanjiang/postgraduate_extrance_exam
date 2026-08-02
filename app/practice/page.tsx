import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { listChapterQuestionCounts } from "@/lib/data/practice";
import { listSubjects, listChaptersForSubject } from "@/lib/data/subjects";
import { createClient } from "@/lib/supabase/server";

export default async function PracticeHubPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const subjects = await listSubjects();
  const chapterCounts = await listChapterQuestionCounts();
  const countMap = new Map(
    chapterCounts.map((item) => [item.chapter_id, item]),
  );
  const subjectSections = await Promise.all(
    subjects.map(async (subject) => ({
      subject,
      chapters: await listChaptersForSubject(subject.id),
    })),
  );

  return (
    <>
      <AppHeader />
      <main className="page">
        <p className="breadcrumb">
          <Link href="/">首页</Link> / 练习
        </p>
        <div className="practice-page-head">
          <div>
            <h1>练习中心</h1>
            <p className="muted">按章节刷题、进入错题本，或补充你自己的题目。</p>
          </div>
          <div className="practice-head-actions">
            <Link href="/practice/wrong" className="btn-secondary">
              错题本
            </Link>
            <Link href="/practice/new" className="btn-secondary">
              新建题目
            </Link>
          </div>
        </div>

        <div className="practice-subject-sections">
          {subjectSections.map(({ subject, chapters }) => (
            <section key={subject.id} className="practice-section-card">
              <h2>{subject.name}</h2>
              {chapters.length === 0 ? (
                <p className="muted">还没有章节数据。</p>
              ) : (
                <ul className="practice-chapter-list">
                  {chapters.map((chapter) => {
                    const counts = countMap.get(chapter.id);
                    return (
                      <li key={chapter.id}>
                        <Link
                          href={`/practice/c/${chapter.id}`}
                          className="practice-chapter-link"
                        >
                          <div>
                            <strong>{chapter.title}</strong>
                            <span className="muted">
                              {counts?.total ?? 0} 题
                            </span>
                          </div>
                          <div className="practice-chapter-side">
                            {(counts?.needs_review ?? 0) > 0 ? (
                              <span className="practice-review-badge">
                                待复核 {counts?.needs_review}
                              </span>
                            ) : null}
                            <span className="practice-go">开始练习 →</span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
