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
