import { validateIndexCharacters } from "./indexCharacters";

describe("validateIndexCharacters", () => {
  it("accepts printable ASCII", () => {
    expect(validateIndexCharacters("P")).toBe(true);
    expect(validateIndexCharacters("Pp")).toBe(true);
    expect(validateIndexCharacters(" ~")).toBe(true);
  });

  it("rejects an empty index", () => {
    expect(validateIndexCharacters("")).toBe(false);
  });

  it("rejects control characters", () => {
    expect(validateIndexCharacters("\n")).toBe(false);
    expect(validateIndexCharacters("a\tb")).toBe(false);
  });

  it("rejects characters outside the printable ASCII range", () => {
    expect(validateIndexCharacters("é")).toBe(false);
    expect(validateIndexCharacters("\u{1f642}")).toBe(false);
  });

  it("rejects an index that is only partly printable ASCII", () => {
    expect(validateIndexCharacters("abé")).toBe(false);
  });
});
