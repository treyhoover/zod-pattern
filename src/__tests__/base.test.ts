import { describe, expect, it } from "@jest/globals";
import { z } from "zod";

import { pattern } from "../index";

describe("match", () => {
  it("matches literal pattern", () => {
    type Strength = "weak" | "medium" | "strong";

    const predictionMatcher = pattern()
      .returnType<Strength>()
      .case(z.number().gte(0.8), "strong")
      .case(z.number().gte(0.5), "medium")
      .default("weak");

    const result = predictionMatcher.match(1);

    expect(result).toEqual("strong");
  });

  it("matches literal pattern with transform functions", () => {
    const predictionMatcher = pattern()
      .case(z.number().gte(0.8), (value) => `strong (${value})`)
      .case(z.number().gte(0.5), (value) => `medium (${value})`)
      .default((value) => `weak (${value})`);

    const result = predictionMatcher.match(1);

    expect(result).toEqual("strong (1)");
  });

  it("matches partial objects", () => {
    const partialMatcher = pattern()
      .case(
        z.object({ key: z.string() }),
        ({ key }) => `Matched via key: "${key}"`
      )
      .default("not matched");

    const result = partialMatcher.match({ key: "magic", unused: "value" });

    expect(result).toEqual(`Matched via key: "magic"`);
  });
});
