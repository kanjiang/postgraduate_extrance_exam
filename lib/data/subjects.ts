import { createClient } from "@/lib/supabase/server";
import type { Chapter, Subject } from "@/lib/types";

export async function listSubjects(): Promise<Subject[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("id, slug, name, sort_order")
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}

export async function getSubjectBySlug(slug: string): Promise<Subject | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subjects")
    .select("id, slug, name, sort_order")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listChaptersForSubject(
  subjectId: string,
): Promise<Chapter[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chapters")
    .select("id, subject_id, parent_id, title, sort_order, user_id")
    .eq("subject_id", subjectId)
    .order("sort_order");
  if (error) throw error;
  return data ?? [];
}
