import type { Node } from "prosemirror-model";
import headingToSlug from "./headingToSlug";

/** The helper only reads textContent, so a minimal stand-in is enough. */
const heading = (textContent: string) => ({ textContent }) as Node;

describe("headingToSlug", () => {
  it("prefixes the slug so it is a valid DOM id", () => {
    expect(headingToSlug(heading("Deployment"))).toBe("h-deployment");
  });

  it("lowercases and hyphenates", () => {
    expect(headingToSlug(heading("Failure Modes"))).toBe("h-failure-modes");
  });

  it("keeps the prefix when the heading starts with a number", () => {
    // querySelector rejects ids that begin with a digit, which is why the
    // prefix exists at all.
    expect(headingToSlug(heading("2024 Review"))).toBe("h-2024-review");
  });

  it("removes punctuation rather than turning it into separators", () => {
    expect(headingToSlug(heading("What's next?"))).toBe("h-whats-next");
    expect(headingToSlug(heading("Costs: a summary"))).toBe("h-costs-a-summary");
  });

  it("returns the bare slug for the first occurrence", () => {
    expect(headingToSlug(heading("Overview"), 0)).toBe("h-overview");
  });

  it("appends the index for repeated headings", () => {
    expect(headingToSlug(heading("Overview"), 1)).toBe("h-overview-1");
    expect(headingToSlug(heading("Overview"), 2)).toBe("h-overview-2");
  });

  it("gives repeated headings distinct slugs", () => {
    const first = headingToSlug(heading("Overview"), 0);
    const second = headingToSlug(heading("Overview"), 1);
    expect(first).not.toBe(second);
  });
});
