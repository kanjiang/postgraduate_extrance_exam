import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { searchPoints } from "@/lib/data/search";
import { createClient } from "@/lib/supabase/server";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const results = q.trim() ? await searchPoints(user.id, q) : [];

  return (
    <>
      <AppHeader />
      <main className="page narrow">
        <h1>搜索</h1>
        <form className="search-form" action="/search" method="get">
          <input
            name="q"
            defaultValue={q}
            placeholder="搜索标题或正文…"
            aria-label="搜索"
          />
          <button type="submit" className="btn-primary">
            搜索
          </button>
        </form>
        {q.trim() ? (
          results.length === 0 ? (
            <p className="muted">没有匹配结果。</p>
          ) : (
            <ul className="simple-list">
              {results.map((p) => (
                <li key={p.id}>
                  <Link href={`/points/${p.id}`}>{p.title}</Link>
                </li>
              ))}
            </ul>
          )
        ) : (
          <p className="muted">输入关键词开始搜索。</p>
        )}
      </main>
    </>
  );
}
