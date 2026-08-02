import { describe, expect, it } from "vitest";
import { computeMcqScore, gradeMcq, normalizeAnswerKey } from "./practice";

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
