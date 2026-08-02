import {
  isCheckinComplete,
  type CheckinFlags,
  type CourseDay,
  type UserCheckin,
} from "@/lib/checkin";
import { createClient } from "@/lib/supabase/server";

export async function listCourseDays(
  from?: string,
  to?: string,
): Promise<CourseDay[]> {
  const supabase = await createClient();
  let q = supabase
    .from("course_days")
    .select(
      "id, day_date, phase, words_task, main_subject, main_lesson, time_hint, micro_task, subject_slug",
    )
    .order("day_date");
  if (from) q = q.gte("day_date", from);
  if (to) q = q.lte("day_date", to);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as CourseDay[];
}

export async function getCourseDay(
  dayDate: string,
): Promise<CourseDay | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("course_days")
    .select(
      "id, day_date, phase, words_task, main_subject, main_lesson, time_hint, micro_task, subject_slug",
    )
    .eq("day_date", dayDate)
    .maybeSingle();
  if (error) throw error;
  return data as CourseDay | null;
}

/** Prefer exact date; else nearest upcoming; else latest past. */
export async function getFocusCourseDay(
  dayDate: string,
): Promise<CourseDay | null> {
  const exact = await getCourseDay(dayDate);
  if (exact) return exact;

  const supabase = await createClient();
  const { data: upcoming, error: uErr } = await supabase
    .from("course_days")
    .select(
      "id, day_date, phase, words_task, main_subject, main_lesson, time_hint, micro_task, subject_slug",
    )
    .gte("day_date", dayDate)
    .order("day_date")
    .limit(1);
  if (uErr) throw uErr;
  if (upcoming?.[0]) return upcoming[0] as CourseDay;

  const { data: past, error: pErr } = await supabase
    .from("course_days")
    .select(
      "id, day_date, phase, words_task, main_subject, main_lesson, time_hint, micro_task, subject_slug",
    )
    .lt("day_date", dayDate)
    .order("day_date", { ascending: false })
    .limit(1);
  if (pErr) throw pErr;
  return (past?.[0] as CourseDay) ?? null;
}

export async function getCheckin(
  userId: string,
  dayDate: string,
): Promise<UserCheckin | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_checkins")
    .select("user_id, day_date, words, lesson, practice, micro, updated_at")
    .eq("user_id", userId)
    .eq("day_date", dayDate)
    .maybeSingle();
  if (error) throw error;
  return data as UserCheckin | null;
}

export async function upsertCheckinFlag(
  userId: string,
  dayDate: string,
  field: keyof CheckinFlags,
  value: boolean,
): Promise<UserCheckin> {
  const existing = await getCheckin(userId, dayDate);
  const next: CheckinFlags = {
    words: existing?.words ?? false,
    lesson: existing?.lesson ?? false,
    practice: existing?.practice ?? false,
    micro: existing?.micro ?? false,
    [field]: value,
  };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_checkins")
    .upsert({
      user_id: userId,
      day_date: dayDate,
      ...next,
      updated_at: new Date().toISOString(),
    })
    .select("user_id, day_date, words, lesson, practice, micro, updated_at")
    .single();
  if (error) throw error;
  return data as UserCheckin;
}

export async function listCheckinsInRange(
  userId: string,
  from: string,
  to: string,
): Promise<UserCheckin[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_checkins")
    .select("user_id, day_date, words, lesson, practice, micro, updated_at")
    .eq("user_id", userId)
    .gte("day_date", from)
    .lte("day_date", to);
  if (error) throw error;
  return (data ?? []) as UserCheckin[];
}

export async function getStreakAndWeekStats(userId: string, today: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_checkins")
    .select("day_date, words, lesson, practice, micro")
    .eq("user_id", userId)
    .order("day_date", { ascending: false })
    .limit(60);
  if (error) throw error;

  const completeDates = new Set(
    (data ?? [])
      .filter((r) => isCheckinComplete(r))
      .map((r) => r.day_date),
  );

  let streak = 0;
  const cursor = new Date(`${today}T12:00:00+08:00`);
  for (;;) {
    const key = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(cursor);
    if (!completeDates.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const weekStart = new Date(`${today}T12:00:00+08:00`);
  const day = weekStart.getDay();
  const diff = day === 0 ? 6 : day - 1;
  weekStart.setDate(weekStart.getDate() - diff);
  let weekDone = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const key = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
    if (completeDates.has(key)) weekDone += 1;
  }

  return { streak, weekDone, weekTotal: 7 };
}
