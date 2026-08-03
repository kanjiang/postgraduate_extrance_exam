import { describe, expect, it } from "vitest";
import {
  assertSessionEditable,
  computeMcqScore,
  filterChapterQuestions,
  getChapterPracticeAvailability,
  gradeMcq,
  normalizeAnswerKey,
  requiresSelfMark,
  shouldSkipSelfMark,
} from "./practice";

describe("normalizeAnswerKey", () => {
  it("trims and uppercases", () => {
    expect(normalizeAnswerKey(" a ")).toBe("A");
  });
});

describe("gradeMcq", () => {
  it("matches ignoring case/space", () => {
    expect(gradeMcq("b", "B")).toBe(true);
    expect(gradeMcq("C", "A")).toBe(false);
  });
});

describe("computeMcqScore", () => {
  it("counts only mcq rows", () => {
    expect(
      computeMcqScore([
        { qtype: "mcq", is_correct: true },
        { qtype: "mcq", is_correct: false },
        { qtype: "short", is_correct: true },
      ]),
    ).toEqual({ correct: 1, total: 2 });
  });
});

describe("assertSessionEditable", () => {
  it("rejects finished sessions with a friendly chinese error", () => {
    expect(() =>
      assertSessionEditable({ finished_at: "2026-08-02T00:00:00.000Z" }),
    ).toThrowError("本次练习已提交，不能再修改答案");
  });
});

describe("filterChapterQuestions", () => {
  const questions = [
    { id: "q1", needs_review: false },
    { id: "q2", needs_review: true },
    { id: "q3", needs_review: false },
  ];

  it("excludes needs_review questions by default", () => {
    expect(filterChapterQuestions(questions)).toEqual([
      { id: "q1", needs_review: false },
      { id: "q3", needs_review: false },
    ]);
  });

  it("includes needs_review questions when explicitly requested", () => {
    expect(filterChapterQuestions(questions, true)).toEqual(questions);
  });
});

describe("getChapterPracticeAvailability", () => {
  it("marks review-only chapters as unavailable", () => {
    expect(
      getChapterPracticeAvailability({ total: 3, reviewable: 0 }),
    ).toBe("review_only");
    expect(
      getChapterPracticeAvailability({ total: 0, reviewable: 0 }),
    ).toBe("empty");
    expect(
      getChapterPracticeAvailability({ total: 3, reviewable: 2 }),
    ).toBe("ready");
  });
});

describe("requiresSelfMark", () => {
  it("marks short and unanswered mcq for self review", () => {
    expect(requiresSelfMark({ qtype: "short", answer: "参考" })).toBe(true);
    expect(requiresSelfMark({ qtype: "mcq", answer: "" })).toBe(true);
    expect(requiresSelfMark({ qtype: "mcq", answer: "B" })).toBe(false);
  });
});

describe("shouldSkipSelfMark", () => {
  it("skips duplicate self-marking", () => {
    expect(shouldSkipSelfMark({ self_marked: true })).toBe(true);
    expect(shouldSkipSelfMark({ self_marked: false })).toBe(false);
  });
});
