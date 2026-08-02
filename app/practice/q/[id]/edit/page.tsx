import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { QuestionEditor } from "@/components/practice/QuestionEditor";
import { getQuestion } from "@/lib/data/practice";
import { listSubjects, listChaptersForSubject } from "@/lib/data/subjects";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPracticeQuestionPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const question = await getQuestion(id);
  if (!question) notFound();

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
          <Link href="/practice">练习</Link> / 编辑题目
        </p>
        <h1>编辑题目</h1>
        <QuestionEditor
          chapters={chapters}
          initialQuestion={question}
          canDelete={question.user_id === user.id}
        />
      </main>
    </>
  );
}
