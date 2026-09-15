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

  it("slugifies text that is only digits", () => {
    expect(slugify("2024")).toBe("2024");
  });

  it("transliterates non-Latin scripts", () => {
    expect(slugify("שלום")).not.toBe("");
  });

  describe("input with nothing to slug", () => {
    it("returns an empty string", () => {
      expect(slugify("")).toBe("");
      expect(slugify("   ")).toBe("");
      expect(slugify("!!!")).toBe("");
      expect(slugify("...")).toBe("");
      expect(slugify("\u{1f642}")).toBe("");
    });

    it("still slugifies a title that mixes text with punctuation", () => {
      expect(slugify("!!! Ship it !!!")).toBe("ship-it");
    });

    it("still slugifies a title that mixes text with an emoji", () => {
      expect(slugify("Ship it \u{1f642}")).toBe("ship-it");
    });
  });
});
