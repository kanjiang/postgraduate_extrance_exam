import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PointEditor } from "@/components/PointEditor";
import { createClient } from "@/lib/supabase/server";

type Props = { searchParams: Promise<{ chapter?: string }> };

export default async function NewPointPage({ searchParams }: Props) {
  const { chapter } = await searchParams;
  if (!chapter) redirect("/");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return (
    <>
      <AppHeader />
      <main className="page narrow">
        <h1>新建知识点</h1>
        <PointEditor chapterId={chapter} />
      </main>
    </>
  );
}
