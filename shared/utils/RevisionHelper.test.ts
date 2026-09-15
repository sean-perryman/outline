import { RevisionHelper } from "./RevisionHelper";

describe("RevisionHelper.latestId", () => {
  it("prefixes the document id", () => {
    expect(RevisionHelper.latestId("abc")).toBe("latest-abc");
  });

  it("returns an empty string when no document id is given", () => {
    expect(RevisionHelper.latestId()).toBe("");
    expect(RevisionHelper.latestId(undefined)).toBe("");
    expect(RevisionHelper.latestId("")).toBe("");
  });
});

describe("RevisionHelper.documentIdFromLatestId", () => {
  it("round-trips with latestId", () => {
    const id = RevisionHelper.latestId("abc");
    expect(RevisionHelper.documentIdFromLatestId(id)).toBe("abc");
  });

  it("returns undefined for an id that is not a latest revision id", () => {
    expect(RevisionHelper.documentIdFromLatestId("abc")).toBeUndefined();
    expect(RevisionHelper.documentIdFromLatestId("")).toBeUndefined();
  });

  it("strips only the leading prefix", () => {
    expect(RevisionHelper.documentIdFromLatestId("latest-latest-abc")).toBe(
      "latest-abc"
    );
  });
});
