import { resolvePoint } from "@/lib/points";
import { createClient } from "@/lib/supabase/server";
import type {
  KnowledgePoint,
  Mastery,
  ResolvedPoint,
  UserPointState,
} from "@/lib/types";

async function getStateMap(
  userId: string,
  pointIds: string[],
): Promise<Map<string, UserPointState>> {
  if (pointIds.length === 0) return new Map();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_point_state")
    .select(
      "user_id, knowledge_point_id, mastery, starred, body_override_md, title_override, updated_at",
    )
    .eq("user_id", userId)
    .in("knowledge_point_id", pointIds);
  if (error) throw error;
  const map = new Map<string, UserPointState>();
  for (const row of data ?? []) {
    map.set(row.knowledge_point_id, row as UserPointState);
  }
  return map;
}

export async function listPointsForChapter(
  chapterId: string,
  userId: string,
): Promise<ResolvedPoint[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("knowledge_points")
    .select(
      "id, chapter_id, title, body_md, sort_order, user_id, source_template_id",
    )
    .eq("chapter_id", chapterId)
    .order("sort_order");
  if (error) throw error;
  const points = (data ?? []) as KnowledgePoint[];
  const states = await getStateMap(
    userId,
    points.map((p) => p.id),
  );
  return points.map((p) => resolvePoint(p, states.get(p.id) ?? null));
}

export async function getResolvedPoint(
  pointId: string,
  userId: string,
): Promise<(ResolvedPoint & { subject_slug?: string }) | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("knowledge_points")
    .select(
      "id, chapter_id, title, body_md, sort_order, user_id, source_template_id",
    )
    .eq("id", pointId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const point = data as KnowledgePoint;
  const states = await getStateMap(userId, [point.id]);
  return resolvePoint(point, states.get(point.id) ?? null);
}

export async function getPointRaw(
  pointId: string,
): Promise<KnowledgePoint | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("knowledge_points")
    .select(
      "id, chapter_id, title, body_md, sort_order, user_id, source_template_id",
    )
    .eq("id", pointId)
    .maybeSingle();
  if (error) throw error;
  return data as KnowledgePoint | null;
}

export async function upsertPointState(
  userId: string,
  pointId: string,
  patch: Partial<{
    mastery: Mastery;
    starred: boolean;
    body_override_md: string | null;
    title_override: string | null;
  }>,
): Promise<void> {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("user_point_state")
    .select(
      "mastery, starred, body_override_md, title_override",
    )
    .eq("user_id", userId)
    .eq("knowledge_point_id", pointId)
    .maybeSingle();

  const row = {
    user_id: userId,
    knowledge_point_id: pointId,
    mastery: patch.mastery ?? existing?.mastery ?? "unlearned",
    starred: patch.starred ?? existing?.starred ?? false,
    body_override_md:
      patch.body_override_md !== undefined
        ? patch.body_override_md
        : (existing?.body_override_md ?? null),
    title_override:
      patch.title_override !== undefined
        ? patch.title_override
        : (existing?.title_override ?? null),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("user_point_state").upsert(row);
  if (error) throw error;
}

export async function createUserPoint(input: {
  userId: string;
  chapterId: string;
  title: string;
  body_md: string;
}): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("knowledge_points")
    .insert({
      chapter_id: input.chapterId,
      title: input.title,
      body_md: input.body_md,
      sort_order: 100,
      user_id: input.userId,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function updateUserPoint(input: {
  userId: string;
  pointId: string;
  title: string;
  body_md: string;
}): Promise<void> {
  const point = await getPointRaw(input.pointId);
  if (!point) throw new Error("知识点不存在");

  if (point.user_id === input.userId) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("knowledge_points")
      .update({ title: input.title, body_md: input.body_md })
      .eq("id", input.pointId)
      .eq("user_id", input.userId);
    if (error) throw error;
    await upsertPointState(input.userId, input.pointId, {});
    return;
  }

  if (point.user_id == null) {
    await upsertPointState(input.userId, input.pointId, {
      title_override: input.title,
      body_override_md: input.body_md,
    });
    return;
  }

  throw new Error("无权编辑该知识点");
}

export async function deleteUserPoint(
  userId: string,
  pointId: string,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("knowledge_points")
    .delete()
    .eq("id", pointId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function listRecent(
  userId: string,
  limit = 8,
): Promise<ResolvedPoint[]> {
  const supabase = await createClient();
  const { data: states, error } = await supabase
    .from("user_point_state")
    .select(
      "user_id, knowledge_point_id, mastery, starred, body_override_md, title_override, updated_at",
    )
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  if (!states?.length) return [];

  const ids = states.map((s) => s.knowledge_point_id);
  const { data: points, error: pErr } = await supabase
    .from("knowledge_points")
    .select(
      "id, chapter_id, title, body_md, sort_order, user_id, source_template_id",
    )
    .in("id", ids);
  if (pErr) throw pErr;
  const map = new Map((points ?? []).map((p) => [p.id, p as KnowledgePoint]));
  return states
    .map((s) => {
      const p = map.get(s.knowledge_point_id);
      if (!p) return null;
      return resolvePoint(p, s as UserPointState);
    })
    .filter((x): x is ResolvedPoint => x != null);
}

export async function listStarred(userId: string): Promise<ResolvedPoint[]> {
  const supabase = await createClient();
  const { data: states, error } = await supabase
    .from("user_point_state")
    .select(
      "user_id, knowledge_point_id, mastery, starred, body_override_md, title_override, updated_at",
    )
    .eq("user_id", userId)
    .eq("starred", true)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  if (!states?.length) return [];

  const ids = states.map((s) => s.knowledge_point_id);
  const { data: points, error: pErr } = await supabase
    .from("knowledge_points")
    .select(
      "id, chapter_id, title, body_md, sort_order, user_id, source_template_id",
    )
    .in("id", ids);
  if (pErr) throw pErr;
  const map = new Map((points ?? []).map((p) => [p.id, p as KnowledgePoint]));
  return states
    .map((s) => {
      const p = map.get(s.knowledge_point_id);
      if (!p) return null;
      return resolvePoint(p, s as UserPointState);
    })
    .filter((x): x is ResolvedPoint => x != null);
}

export async function getChapterSubjectSlug(
  chapterId: string,
): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chapters")
    .select("subject_id, subjects(slug)")
    .eq("id", chapterId)
    .maybeSingle();
  if (error) throw error;
  const subjects = data?.subjects as { slug: string } | { slug: string }[] | null;
  if (!subjects) return null;
  if (Array.isArray(subjects)) return subjects[0]?.slug ?? null;
  return subjects.slug;
}
