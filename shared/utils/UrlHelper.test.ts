import { UrlHelper } from "./UrlHelper";

describe("SLUG_URL_REGEX", () => {
  const match = (input: string) => input.match(UrlHelper.SLUG_URL_REGEX);

  it("captures the url id from a slugified document url", () => {
    expect(match("my-document-abc123def456")?.[1]).toBe("abc123def456");
  });

  it("captures the url id when there is no slug at all", () => {
    expect(match("abc123def456")?.[1]).toBe("abc123def456");
  });

  it("captures only the trailing id from a multi-segment slug", () => {
    expect(match("design-review-q3-planning-abc123def456")?.[1]).toBe(
      "abc123def456"
    );
  });

  it("accepts url ids between ten and fifteen characters", () => {
    expect(match("a".repeat(10))).not.toBeNull();
    expect(match("a".repeat(15))).not.toBeNull();
  });

  it("rejects url ids outside that length", () => {
    expect(match("a".repeat(9))).toBeNull();
    expect(match("a".repeat(16))).toBeNull();
  });

  it("rejects an empty string", () => {
    expect(match("")).toBeNull();
  });

  it("rejects a trailing segment that is too short to be a url id", () => {
    expect(match("abc123-def456")).toBeNull();
  });

  it("rejects a url id containing a separator", () => {
    expect(match("abc123_def456")).toBeNull();
  });
});

describe("SHARE_URL_SLUG_REGEX", () => {
  const test = (input: string) => UrlHelper.SHARE_URL_SLUG_REGEX.test(input);

  it("accepts lowercase alphanumerics and hyphens", () => {
    expect(test("my-shared-doc")).toBe(true);
    expect(test("doc2")).toBe(true);
  });

  it("rejects uppercase", () => {
    expect(test("My-Shared-Doc")).toBe(false);
  });

  it("rejects an empty slug", () => {
    expect(test("")).toBe(false);
  });

  it("rejects slashes and other punctuation", () => {
    expect(test("my/doc")).toBe(false);
    expect(test("my_doc")).toBe(false);
    expect(test("my doc")).toBe(false);
  });
});
