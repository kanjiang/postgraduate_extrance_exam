import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { QuestionEditor } from "@/components/practice/QuestionEditor";
import { listSubjects, listChaptersForSubject } from "@/lib/data/subjects";
import { createClient } from "@/lib/supabase/server";

export default async function NewPracticeQuestionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const subjects = await listSubjects();
  const chapterGroups = await Promise.all(
    subjects.map(async (subject) => ({
      subject,
      chapters: await listChaptersForSubject(subject.id),
    })),
  );
  const chapters = chapterGroups.flatMap(({ subject, chapters: chapterList }) =>
    chapterList.map((chapter) => ({
      id: chapter.id,
      label: `${subject.name} / ${chapter.title}`,
    })),
  );

  return (
    <>
      <AppHeader />
      <main className="page narrow">
        <p className="breadcrumb">
          <Link href="/practice">练习</Link> / 新建题目
        </p>
        <h1>新建题目</h1>
        <p className="muted">支持录入选择题和简答题，选择题请按 4 行填写选项。</p>
        <QuestionEditor chapters={chapters} />
      </main>
    </>
  );
}
