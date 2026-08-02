import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { startWrongBookPracticeAction } from "@/app/practice/actions";
import { listActiveWrongQuestions } from "@/lib/data/practice";
import { createClient } from "@/lib/supabase/server";

type ChapterMeta = {
  id: string;
  title: string;
};

export default async function WrongBookPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const questions = await listActiveWrongQuestions(user.id);
  const chapterIds = [...new Set(questions.map((question) => question.chapter_id))];
  const chapterMap = new Map<string, string>();
  if (chapterIds.length > 0) {
    const { data, error } = await supabase
      .from("chapters")
      .select("id, title")
      .in("id", chapterIds);
    if (error) throw error;

    for (const chapter of (data ?? []) as ChapterMeta[]) {
      chapterMap.set(chapter.id, chapter.title);
    }
  }
  const startAction = startWrongBookPracticeAction;

  return (
    <>
      <AppHeader />
      <main className="page narrow">
        <p className="breadcrumb">
          <Link href="/practice">练习</Link> / 错题本
        </p>
        <h1>错题本</h1>
        <p className="muted">这里汇总了当前仍未清除的错题，可以集中回炉。</p>

        <section className="practice-section-card">
          <p>
            当前共有 <strong>{questions.length}</strong> 道活跃错题。
          </p>
          {questions.length > 0 ? (
            <form action={startAction}>
              <button type="submit" className="btn-primary">
                开始错题练习
              </button>
            </form>
          ) : (
            <p className="muted">继续保持，暂时没有需要重做的题目。</p>
          )}
        </section>

        {questions.length > 0 ? (
          <ul className="practice-question-summary-list">
            {questions.map((question) => (
              <li key={question.id} className="practice-summary-card">
                <div className="practice-summary-head">
                  <strong>
                    {question.qtype === "mcq" ? "选择题" : "简答题"}
                  </strong>
                  {question.needs_review ? (
                    <span className="practice-review-badge">待复核</span>
                  ) : null}
                </div>
                <p>{question.stem}</p>
                <p className="muted">
                  {chapterMap.get(question.chapter_id) ?? "未知章节"}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </main>
    </>
  );
}
