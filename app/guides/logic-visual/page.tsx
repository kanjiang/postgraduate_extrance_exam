import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { MarkdownBody } from "@/components/MarkdownBody";
import { LOGIC_VISUAL_SUMMARY } from "@/content/logic-visual-summary";
import { createClient } from "@/lib/supabase/server";

export default async function LogicVisualSummaryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return (
    <>
      <AppHeader />
      <main className="page narrow guide-page">
        <p className="breadcrumb">
          <Link href="/">首页</Link> / <Link href="/nav">导航</Link> /{" "}
          <Link href="/subjects/logic">逻辑</Link> / 形象化汇总
        </p>
        <MarkdownBody content={LOGIC_VISUAL_SUMMARY} />
        <p className="guide-footer muted">
          来源：本地材料《考研逻辑形象化知识点汇总》· 可配合章节笔记一起复习
        </p>
      </main>
    </>
  );
}
