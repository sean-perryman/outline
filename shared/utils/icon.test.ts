import { IconType } from "../types";
import { determineIconType } from "./icon";

describe("determineIconType", () => {
  it("recognises a built-in outline icon by name", () => {
    expect(determineIconType("academicCap")).toBe(IconType.SVG);
    expect(determineIconType("bookmark")).toBe(IconType.SVG);
  });

  it("recognises a custom icon by its UUID", () => {
    expect(determineIconType("f5f0b2c4-8a1e-4b3a-9d2f-6c7e8a9b0c1d")).toBe(
      IconType.Custom
    );
  });

  it("treats anything else as an emoji", () => {
    expect(determineIconType("\u{1f642}")).toBe(IconType.Emoji);
    expect(determineIconType("notAnIconName")).toBe(IconType.Emoji);
  });

  it("returns undefined when no icon is set", () => {
    expect(determineIconType()).toBeUndefined();
    expect(determineIconType(null)).toBeUndefined();
    expect(determineIconType("")).toBeUndefined();
  });

  it("is case sensitive about built-in names", () => {
    expect(determineIconType("AcademicCap")).toBe(IconType.Emoji);
  });
});
