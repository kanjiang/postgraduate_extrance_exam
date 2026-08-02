import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PracticeForm } from "@/components/practice/PracticeForm";
import { getSessionBundle } from "@/lib/data/practice";
import { createClient } from "@/lib/supabase/server";

type Props = {
  searchParams: Promise<{ session?: string }>;
};

export default async function WrongBookTakePage({ searchParams }: Props) {
  const { session: sessionId } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  if (!sessionId) redirect("/practice/wrong");

  const bundle = await getSessionBundle(sessionId, user.id);
  if (bundle.session.mode !== "wrong_book") {
    redirect("/practice");
  }
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
          <Link href="/practice">练习</Link> / <Link href="/practice/wrong">错题本</Link> / 练习中
        </p>
        <h1>错题本练习</h1>
        <p className="muted">错题练习同样不会向前端透出参考答案或解析，提交后统一查看结果。</p>
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
