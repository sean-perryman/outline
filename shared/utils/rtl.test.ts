import { isRTL, isRTLLanguage } from "./rtl";

describe("isRTL", () => {
  it("detects text that opens with RTL script", () => {
    expect(isRTL("שלום")).toBe(true);
    expect(isRTL("مرحبا")).toBe(true);
  });

  it("returns false for Latin text", () => {
    expect(isRTL("hello")).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(isRTL("")).toBe(false);
  });

  it("looks at the first strongly directional character only", () => {
    expect(isRTL("hello שלום")).toBe(false);
    expect(isRTL("123 שלום")).toBe(true);
  });
});

describe("isRTLLanguage", () => {
  it("recognises RTL language codes", () => {
    expect(isRTLLanguage("ar")).toBe(true);
    expect(isRTLLanguage("he")).toBe(true);
    expect(isRTLLanguage("fa")).toBe(true);
  });

  it("accepts both CLDR and BCP47 region forms", () => {
    expect(isRTLLanguage("he_IL")).toBe(true);
    expect(isRTLLanguage("he-IL")).toBe(true);
  });

  it("is case insensitive", () => {
    expect(isRTLLanguage("HE-IL")).toBe(true);
  });

  it("returns false for LTR languages", () => {
    expect(isRTLLanguage("en_US")).toBe(false);
    expect(isRTLLanguage("ja")).toBe(false);
  });

  it("returns false for a missing locale", () => {
    expect(isRTLLanguage(null)).toBe(false);
    expect(isRTLLanguage(undefined)).toBe(false);
    expect(isRTLLanguage("")).toBe(false);
  });
});
