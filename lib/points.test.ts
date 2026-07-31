import { describe, expect, it } from "vitest";
import { nextMastery, resolvePoint } from "./points";
import type { KnowledgePoint, UserPointState } from "./types";

const template: KnowledgePoint = {
  id: "p1",
  chapter_id: "c1",
  title: "假言推理",
  body_md: "模板正文",
  sort_order: 1,
  user_id: null,
  source_template_id: null,
};

describe("resolvePoint", () => {
  it("uses template when no state", () => {
    const r = resolvePoint(template, null);
    expect(r.title).toBe("假言推理");
    expect(r.body_md).toBe("模板正文");
    expect(r.mastery).toBe("unlearned");
    expect(r.starred).toBe(false);
    expect(r.isUserOwned).toBe(false);
  });

  it("prefers overrides", () => {
    const state: UserPointState = {
      user_id: "u1",
      knowledge_point_id: "p1",
      mastery: "fuzzy",
      starred: true,
      body_override_md: "我的笔记",
      title_override: "假言·个人",
      updated_at: "2026-07-31T00:00:00Z",
    };
    const r = resolvePoint(template, state);
    expect(r.title).toBe("假言·个人");
    expect(r.body_md).toBe("我的笔记");
    expect(r.mastery).toBe("fuzzy");
    expect(r.starred).toBe(true);
  });
});

describe("nextMastery", () => {
  it("cycles three states", () => {
    expect(nextMastery("unlearned")).toBe("fuzzy");
    expect(nextMastery("fuzzy")).toBe("mastered");
    expect(nextMastery("mastered")).toBe("unlearned");
  });
});
