import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PointEditor } from "@/components/PointEditor";
import { getResolvedPoint } from "@/lib/data/points";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export default async function EditPointPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const point = await getResolvedPoint(id, user.id);
  if (!point) notFound();

  return (
    <>
      <AppHeader />
      <main className="page narrow">
        <h1>编辑知识点</h1>
        <PointEditor
          pointId={point.id}
          initialTitle={point.title}
          initialBody={point.body_md}
        />
      </main>
    </>
  );
}
