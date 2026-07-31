import { resolvePoint } from "@/lib/points";
import { createClient } from "@/lib/supabase/server";
import type { KnowledgePoint, ResolvedPoint, UserPointState } from "@/lib/types";

export async function searchPoints(
  userId: string,
  query: string,
): Promise<ResolvedPoint[]> {
  const q = query.trim();
  if (!q) return [];

  const supabase = await createClient();
  const pattern = `%${q}%`;
  const [byTitle, byBody] = await Promise.all([
    supabase
      .from("knowledge_points")
      .select(
        "id, chapter_id, title, body_md, sort_order, user_id, source_template_id",
      )
      .ilike("title", pattern)
      .limit(40),
    supabase
      .from("knowledge_points")
      .select(
        "id, chapter_id, title, body_md, sort_order, user_id, source_template_id",
      )
      .ilike("body_md", pattern)
      .limit(40),
  ]);
  if (byTitle.error) throw byTitle.error;
  if (byBody.error) throw byBody.error;

  const map = new Map<string, KnowledgePoint>();
  for (const row of [...(byTitle.data ?? []), ...(byBody.data ?? [])]) {
    map.set(row.id, row as KnowledgePoint);
  }
  const points = [...map.values()];
  if (points.length === 0) return [];

  const { data: states, error: sErr } = await supabase
    .from("user_point_state")
    .select(
      "user_id, knowledge_point_id, mastery, starred, body_override_md, title_override, updated_at",
    )
    .eq("user_id", userId)
    .in(
      "knowledge_point_id",
      points.map((p) => p.id),
    );
  if (sErr) throw sErr;

  const stateMap = new Map(
    (states ?? []).map((s) => [s.knowledge_point_id, s as UserPointState]),
  );
  return points.map((p) => resolvePoint(p, stateMap.get(p.id) ?? null));
}
