import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { startChapterPracticeAction } from "@/app/practice/actions";
import { PracticeForm } from "@/components/practice/PracticeForm";
import {
  getSessionBundle,
  listQuestionsForChapter,
} from "@/lib/data/practice";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ chapterId: string }>;
  searchParams: Promise<{ session?: string }>;
};

type ChapterRow = {
  id: string;
  title: string;
  subject_id: string;
  subjects: { name: string; slug: string } | { name: string; slug: string }[] | null;
};

export default async function ChapterPracticePage({
  params,
  searchParams,
}: Props) {
  const { chapterId } = await params;
  const { session: sessionId } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("chapters")
    .select("id, title, subject_id, subjects(name, slug)")
    .eq("id", chapterId)
    .maybeSingle();
  if (error) throw error;
  if (!data) notFound();

  const chapter = data as ChapterRow;
  const subject = Array.isArray(chapter.subjects)
    ? chapter.subjects[0] ?? null
    : chapter.subjects;

  if (!sessionId) {
    const questions = await listQuestionsForChapter(chapterId);
    const startAction = startChapterPracticeAction.bind(null, chapterId);

    return (
      <>
        <AppHeader />
        <main className="page narrow">
          <p className="breadcrumb">
            <Link href="/practice">练习</Link>
            {subject ? ` / ${subject.name}` : ""}
            {" / "}
            {chapter.title}
          </p>
          <h1>{chapter.title}</h1>
          <section className="practice-section-card">
            <p className="muted">本章节共有 {questions.length} 道题，进入后可先保存草稿，再统一提交评分。</p>
            <form action={startAction}>
              <button type="submit" className="btn-primary">
                开始练习
              </button>
            </form>
          </section>
        </main>
      </>
    );
  }

  const bundle = await getSessionBundle(sessionId, user.id);
  if (bundle.session.chapter_id !== chapterId) notFound();
  if (bundle.session.finished_at) {
    redirect(`/practice/session/${bundle.session.id}`);
  }

  const initialAnswers = Object.fromEntries(
    bundle.answers.map((answer) => [answer.question_id, answer.user_answer]),
  );
  const questions = bundle.questions.map(
    ({ answer, explanation, ...question }) => question,
  );

  return (
    <>
      <AppHeader />
      <main className="page narrow">
        <p className="breadcrumb">
          <Link href="/practice">练习</Link>
          {subject ? ` / ${subject.name}` : ""}
          {" / "}
          {chapter.title}
        </p>
        <h1>{chapter.title}</h1>
        <p className="muted">答题页不下发参考答案与解析，提交后再进入结果页查看。</p>
        <PracticeForm
          sessionId={bundle.session.id}
          questions={questions}
          initialAnswers={initialAnswers}
          mode="take"
        />
      </main>
    </>
  );
}
