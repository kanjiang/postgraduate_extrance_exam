export type StudyPhase = "foundation" | "special" | "sprint";
export type MainSubject = "english" | "math" | "logic" | "writing";

export type CourseDay = {
  id: string;
  day_date: string;
  phase: StudyPhase;
  words_task: string;
  main_subject: MainSubject;
  main_lesson: string;
  time_hint: string | null;
  micro_task: string;
  subject_slug: string | null;
};

export type UserCheckin = {
  user_id: string;
  day_date: string;
  words: boolean;
  lesson: boolean;
  practice: boolean;
  micro: boolean;
  updated_at: string;
};

export type CheckinFlags = {
  words: boolean;
  lesson: boolean;
  practice: boolean;
  micro: boolean;
};

export const SUBJECT_LABEL: Record<MainSubject, string> = {
  english: "英语",
  math: "数学",
  logic: "逻辑",
  writing: "写作",
};

export const PHASE_LABEL: Record<StudyPhase, string> = {
  foundation: "基础阶段",
  special: "专项阶段",
  sprint: "冲刺阶段",
};

export function isCheckinComplete(c: CheckinFlags | null | undefined): boolean {
  if (!c) return false;
  return c.words && c.lesson && c.practice && c.micro;
}

export function todayDateString(timeZone = "Asia/Shanghai"): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
