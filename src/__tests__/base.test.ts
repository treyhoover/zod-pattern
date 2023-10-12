import { describe, expect, it } from "@jest/globals";
import { z } from "zod";

import { match } from "../index";

describe("match", () => {
  it("matches literal pattern", () => {
    const result = match("hello")
      .case(z.literal("hello"), "matched")
      .case(z.literal("world"), "not matched")
      .default("default");

    expect(result).toEqual("matched");
  });

  it("matches object pattern", () => {
    const result = match({ key: "value" })
      .case(z.object({ key: z.string() }), { matched: true })
      .default({ matched: false });

    expect(result).toEqual({ matched: true });
  });

  it("matches number ranges", () => {
    const result = match(7)
      .case(z.number().min(5).max(10), "within range")
      .default("out of range");

    expect(result).toEqual("within range");
  });

  it("falls back to input if no match found", () => {
    const result = match("test")
      .case(z.literal("hello"), "hello")
      .default((input) => input);

    expect(result).toEqual("test");
  });

  it("matches partial objects", () => {
    const result = match({ key: "value", other: "other" })
      .case(z.object({ key: z.string() }), "matched" as const)
      .default("not matched" as const);

    expect(result).toEqual("matched");
  });
});
