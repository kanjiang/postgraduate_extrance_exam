import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { listSubjects } from "@/lib/data/subjects";
import { createClient } from "@/lib/supabase/server";

type NavItem = {
  href: string;
  title: string;
  desc: string;
};

const STUDY_ITEMS: NavItem[] = [
  {
    href: "/today",
    title: "今日打卡",
    desc: "单词 · 主课 · 练习 · 微任务",
  },
  {
    href: "/schedule",
    title: "学习课表",
    desc: "按日期查看课程与完成情况",
  },
  {
    href: "/practice",
    title: "题库练习",
    desc: "按章节刷题、查看成绩",
  },
  {
    href: "/practice/wrong",
    title: "错题本",
    desc: "复习做错的题目",
  },
];

const TOOL_ITEMS: NavItem[] = [
  {
    href: "/",
    title: "首页",
    desc: "三科入口、最近复习与收藏",
  },
  {
    href: "/search",
    title: "搜索",
    desc: "按标题或正文检索知识点",
  },
];

export default async function NavPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const subjects = await listSubjects();

  return (
    <>
      <AppHeader />
      <main className="page narrow">
        <h1>导航</h1>
        <p className="muted">快速进入备考站各功能</p>

        <section className="nav-section">
          <h2>学习打卡</h2>
          <ul className="nav-grid">
            {STUDY_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-card">
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="nav-section">
          <h2>专题汇总</h2>
          <ul className="nav-grid">
            <li>
              <Link href="/guides/logic-visual" className="nav-card">
                <strong>逻辑形象化知识点汇总</strong>
                <span>形式 / 论证 / 综合推理 · 口诀与应试策略</span>
              </Link>
            </li>
          </ul>
        </section>

        <section className="nav-section">
          <h2>知识点</h2>
          <ul className="nav-grid">
            {TOOL_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-card">
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </Link>
              </li>
            ))}
            {subjects.map((s) => (
              <li key={s.id}>
                <Link href={`/subjects/${s.slug}`} className="nav-card">
                  <strong>{s.name}</strong>
                  <span>章节与知识点笔记</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
