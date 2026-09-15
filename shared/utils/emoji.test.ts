import { EmojiSkinTone } from "../types";
import { getEmojiId, getEmojiVariants, getEmojis, search } from "./emoji";

const smile = "\u{1f642}";

describe("getEmojiId", () => {
  it("resolves an emoji to its human-readable id", () => {
    expect(getEmojiId(smile)).toBe("slightly_smiling_face");
  });

  it("returns undefined for text that is not an emoji", () => {
    expect(getEmojiId("not an emoji")).toBeUndefined();
  });

  // An empty query matches every emoji rather than none, so the first entry in
  // the index comes back. Pinned rather than changed: callers pass a real emoji,
  // and returning undefined here would be a behaviour change on its own.
  it("returns the first indexed emoji for an empty string", () => {
    expect(getEmojiId("")).toBe("100");
  });
});

describe("getEmojis", () => {
  it("round-trips an id back to its emoji", () => {
    const id = getEmojiId(smile) as string;
    const [emoji] = getEmojis({ ids: [id], skinTone: EmojiSkinTone.Default });
    expect(emoji.id).toBe(id);
    expect(emoji.value).toBe(smile);
  });

  it("preserves the order of the ids it is given", () => {
    const ids = ["grinning", "slightly_smiling_face"];
    expect(
      getEmojis({ ids, skinTone: EmojiSkinTone.Default }).map((e) => e.id)
    ).toEqual(ids);
  });

  it("returns an empty list for no ids", () => {
    expect(getEmojis({ ids: [], skinTone: EmojiSkinTone.Default })).toEqual([]);
  });

  it("falls back to the default variant for an emoji with no skin tones", () => {
    const id = getEmojiId(smile) as string;
    expect(getEmojiVariants({ id })).toHaveProperty(EmojiSkinTone.Default);

    const [emoji] = getEmojis({ ids: [id], skinTone: EmojiSkinTone.Medium });
    expect(emoji.value).toBe(smile);
  });
});

describe("search", () => {
  it("finds emoji by name", () => {
    const results = search({ query: "smile" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((e) => e.id === "slightly_smiling_face")).toBe(true);
  });

  it("is case insensitive", () => {
    expect(search({ query: "SMILE" }).length).toBe(
      search({ query: "smile" }).length
    );
  });

  it("returns nothing for a query that matches no emoji", () => {
    expect(search({ query: "zzzzzzzznotanemoji" })).toEqual([]);
  });
});
