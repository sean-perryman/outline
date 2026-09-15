import slugify from "./slugify";

describe("slugify", () => {
  it("lowercases and joins words with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("collapses runs of whitespace", () => {
    expect(slugify("Hello   World")).toBe("hello-world");
  });

  it("removes periods rather than turning them into separators", () => {
    expect(slugify("Release 1.2")).toBe("release-12");
  });

  it("is stable when applied twice", () => {
    const once = slugify("Design Review: Q3 Planning");
    expect(slugify(once)).toBe(once);
  });

  it("returns an empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  // The underlying `slug` package does not return an empty string when the
  // input has nothing sluggable in it — it falls back to a base-36 encoding of
  // the input's character codes. So a document titled only with punctuation or
  // an emoji gets a URL slug that looks like line noise rather than no slug at
  // all. The fallback is deterministic, so these assertions are stable; they
  // are here to pin behaviour that is easy to assume works the other way.
  describe("input with no sluggable characters", () => {
    it("falls back to an encoding rather than an empty string", () => {
      expect(slugify("   ")).toBe("icag");
      expect(slugify("!!!")).toBe("iseh");
      expect(slugify("\u{1f642}")).toBe("8jzgg");
    });

    it("is deterministic for the same input", () => {
      expect(slugify("   ")).toBe(slugify("   "));
    });

    it("still varies with the input", () => {
      expect(slugify(" ")).not.toBe(slugify("   "));
    });
  });
});
