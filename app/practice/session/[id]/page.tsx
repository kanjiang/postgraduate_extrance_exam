import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { SelfMarkButtons } from "@/components/practice/SelfMarkButtons";
import { getSessionBundle } from "@/lib/data/practice";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PracticeSessionPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const bundle = await getSessionBundle(id, user.id);
  if (!bundle.session.finished_at) {
    if (bundle.session.mode === "wrong_book") {
      redirect(`/practice/wrong/take?session=${bundle.session.id}`);
    }
    redirect(`/practice/c/${bundle.session.chapter_id}?session=${bundle.session.id}`);
  }

  const answerMap = new Map(
    bundle.answers.map((answer) => [answer.question_id, answer]),
  );
  const totalCorrect =
    bundle.session.mcq_correct + bundle.session.short_marked_correct;
  const totalQuestions = bundle.session.mcq_total + bundle.session.short_total;
  const pendingShortMarks = bundle.questions.filter((question) => {
    if (question.qtype !== "short") return false;
    return answerMap.get(question.id)?.self_marked !== true;
  }).length;

  return (
    <>
      <AppHeader />
      <main className="page narrow">
        <p className="breadcrumb">
          <Link href="/practice">练习</Link> / 结果
        </p>
        <h1>练习结果</h1>
        <section className="practice-score-card">
          <p className="practice-score-number">
            {totalCorrect} / {totalQuestions}
          </p>
          <p className="muted">
            选择题 {bundle.session.mcq_correct} / {bundle.session.mcq_total}
            {" · "}
            简答题已判对 {bundle.session.short_marked_correct} / {bundle.session.short_total}
          </p>
          {pendingShortMarks > 0 ? (
            <p className="muted">还有 {pendingShortMarks} 道简答题等待你手动判分。</p>
          ) : null}
        </section>

        <ol className="practice-question-summary-list">
          {bundle.questions.map((question, index) => {
            const answer = answerMap.get(question.id);
            const answerText = answer?.user_answer?.trim() || "未作答";
            const status =
              answer?.is_correct == null
                ? "待判分"
                : answer.is_correct
                  ? "答对"
                  : "答错";

            return (
              <li key={question.id} className="practice-summary-card">
                <div className="practice-summary-head">
                  <strong>
                    第 {index + 1} 题 ·
                    {question.qtype === "mcq" ? " 选择题" : " 简答题"}
                  </strong>
                  <span
                    className={
                      answer?.is_correct === true
                        ? "practice-status ok"
                        : answer?.is_correct === false
                          ? "practice-status bad"
                          : "practice-status"
                    }
                  >
                    {status}
                  </span>
                </div>
                <p className="practice-stem">{question.stem}</p>
                {question.options?.length ? (
                  <ul className="practice-result-options">
                    {question.options.map((option) => (
                      <li key={option.key}>
                        {option.key}. {option.text}
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="practice-result-grid">
                  <div>
                    <span className="muted">你的答案</span>
                    <p>{answerText}</p>
                  </div>
                  <div>
                    <span className="muted">参考答案</span>
                    <p>{question.answer}</p>
                  </div>
                </div>
                <div>
                  <span className="muted">解析</span>
                  <p>{question.explanation || "暂无解析"}</p>
                </div>

                {question.qtype === "short" && answer?.self_marked !== true ? (
                  <SelfMarkButtons
                    sessionId={bundle.session.id}
                    questionId={question.id}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </main>
    </>
  );
}
