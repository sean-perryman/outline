import { HeadingPrefixStyle } from "../types";
import { formatCounter, toAlpha, toRoman } from "./counters";

describe("toAlpha", () => {
  it("maps the first 26 values onto single letters", () => {
    expect(toAlpha(1)).toBe("a");
    expect(toAlpha(26)).toBe("z");
  });

  it("carries into a second letter like a spreadsheet column", () => {
    expect(toAlpha(27)).toBe("aa");
    expect(toAlpha(28)).toBe("ab");
    expect(toAlpha(52)).toBe("az");
    expect(toAlpha(53)).toBe("ba");
  });

  it("returns an empty string for values below one", () => {
    expect(toAlpha(0)).toBe("");
  });
});

describe("toRoman", () => {
  it("converts the values the numeral table names directly", () => {
    expect(toRoman(1)).toBe("i");
    expect(toRoman(4)).toBe("iv");
    expect(toRoman(5)).toBe("v");
    expect(toRoman(9)).toBe("ix");
    expect(toRoman(1000)).toBe("m");
  });

  it("composes values the table does not name", () => {
    expect(toRoman(14)).toBe("xiv");
    expect(toRoman(1987)).toBe("mcmlxxxvii");
  });

  it("returns an empty string for values below one", () => {
    expect(toRoman(0)).toBe("");
  });
});

describe("formatCounter", () => {
  it("returns the bare number for the numeric style at any depth", () => {
    expect(formatCounter(4, 0, HeadingPrefixStyle.Numeric)).toBe("4");
    expect(formatCounter(4, 3, HeadingPrefixStyle.Numeric)).toBe("4");
  });

  it("cycles numeric, alpha, roman for the alphanumeric style", () => {
    expect(formatCounter(4, 0, HeadingPrefixStyle.Alphanumeric)).toBe("4");
    expect(formatCounter(4, 1, HeadingPrefixStyle.Alphanumeric)).toBe("d");
    expect(formatCounter(4, 2, HeadingPrefixStyle.Alphanumeric)).toBe("iv");
  });

  it("repeats the alphanumeric cycle every three levels", () => {
    expect(formatCounter(4, 3, HeadingPrefixStyle.Alphanumeric)).toBe("4");
    expect(formatCounter(4, 4, HeadingPrefixStyle.Alphanumeric)).toBe("d");
  });

  it("runs the five-level outline cycle", () => {
    expect(formatCounter(4, 0, HeadingPrefixStyle.Outline)).toBe("IV");
    expect(formatCounter(4, 1, HeadingPrefixStyle.Outline)).toBe("D");
    expect(formatCounter(4, 2, HeadingPrefixStyle.Outline)).toBe("4");
    expect(formatCounter(4, 3, HeadingPrefixStyle.Outline)).toBe("d");
    expect(formatCounter(4, 4, HeadingPrefixStyle.Outline)).toBe("iv");
  });

  it("repeats the outline cycle every five levels", () => {
    expect(formatCounter(4, 5, HeadingPrefixStyle.Outline)).toBe("IV");
  });
});
