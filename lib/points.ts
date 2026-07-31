import type {
  KnowledgePoint,
  Mastery,
  ResolvedPoint,
  UserPointState,
} from "./types";

export function resolvePoint(
  point: KnowledgePoint,
  state: UserPointState | null,
): ResolvedPoint {
  return {
    id: point.id,
    chapter_id: point.chapter_id,
    title: state?.title_override ?? point.title,
    body_md: state?.body_override_md ?? point.body_md,
    mastery: state?.mastery ?? "unlearned",
    starred: state?.starred ?? false,
    isUserOwned: point.user_id != null,
    updated_at: state?.updated_at ?? null,
  };
}

export function nextMastery(current: Mastery): Mastery {
  if (current === "unlearned") return "fuzzy";
  if (current === "fuzzy") return "mastered";
  return "unlearned";
}
