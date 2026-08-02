export type Mastery = "unlearned" | "fuzzy" | "mastered";

export type Subject = {
  id: string;
  slug: string;
  name: string;
  sort_order: number;
};

export type Chapter = {
  id: string;
  subject_id: string;
  parent_id: string | null;
  title: string;
  sort_order: number;
  user_id: string | null;
};

export type KnowledgePoint = {
  id: string;
  chapter_id: string;
  title: string;
  body_md: string;
  sort_order: number;
  user_id: string | null;
  source_template_id: string | null;
};

export type UserPointState = {
  user_id: string;
  knowledge_point_id: string;
  mastery: Mastery;
  starred: boolean;
  body_override_md: string | null;
  title_override: string | null;
  updated_at: string;
};

export type ResolvedPoint = {
  id: string;
  chapter_id: string;
  title: string;
  body_md: string;
  mastery: Mastery;
  starred: boolean;
  isUserOwned: boolean;
  updated_at: string | null;
};

export type QuestionType = "mcq" | "short";

export type QuestionOption = { key: string; text: string };

export type Question = {
  id: string;
  chapter_id: string;
  qtype: QuestionType;
  stem: string;
  options: QuestionOption[] | null;
  answer: string;
  explanation: string;
  source_file: string | null;
  source_page: number | null;
  needs_review: boolean;
  sort_order: number;
  user_id: string | null;
};

export type PracticeMode = "chapter" | "wrong_book";

export type PracticeSession = {
  id: string;
  user_id: string;
  chapter_id: string | null;
  mode: PracticeMode;
  started_at: string;
  finished_at: string | null;
  mcq_correct: number;
  mcq_total: number;
  short_marked_correct: number;
  short_total: number;
};

export type PracticeAnswer = {
  session_id: string;
  question_id: string;
  user_answer: string;
  is_correct: boolean | null;
  self_marked: boolean;
};

export type WrongBookEntry = {
  user_id: string;
  question_id: string;
  wrong_count: number;
  last_wrong_at: string;
  cleared_at: string | null;
};
