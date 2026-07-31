import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { SubjectCard } from "@/components/SubjectCard";
import { listRecent, listStarred } from "@/lib/data/points";
import { listSubjects } from "@/lib/data/subjects";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [subjects, recent, starred] = await Promise.all([
    listSubjects(),
    listRecent(user.id),
    listStarred(user.id),
  ]);

  return (
    <>
      <AppHeader />
      <main className="page">
        <section className="hero">
          <h1 className="hero-brand">工程管理备考</h1>
          <p className="hero-line">逻辑 · 数学 · 英语二 — 知识点整理与复习</p>
        </section>

        <section className="subject-grid">
          {subjects.map((s) => (
            <SubjectCard key={s.id} subject={s} />
          ))}
        </section>

        <section className="home-lists">
          <div>
            <h2>最近复习</h2>
            {recent.length === 0 ? (
              <p className="muted">还没有复习记录，去打开一个知识点吧。</p>
            ) : (
              <ul className="simple-list">
                {recent.map((p) => (
                  <li key={p.id}>
                    <Link href={`/points/${p.id}`}>{p.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h2>收藏</h2>
            {starred.length === 0 ? (
              <p className="muted">暂无收藏。</p>
            ) : (
              <ul className="simple-list">
                {starred.map((p) => (
                  <li key={p.id}>
                    <Link href={`/points/${p.id}`}>{p.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
