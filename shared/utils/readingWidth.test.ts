import { ReadingWidth } from "../types";
import { EditorStyleHelper } from "../editor/styles/EditorStyleHelper";
import { documentWidthFor } from "./readingWidth";

describe("documentWidthFor", () => {
  it("returns a distinct width for each preference", () => {
    const widths = Object.values(ReadingWidth).map(documentWidthFor);
    expect(new Set(widths).size).toBe(widths.length);
  });

  it("leaves the standard width exactly as it has always been", () => {
    // A reader who never touches the preference must see no change, so this
    // has to stay pinned to the editor's own constant rather than a copy of it.
    expect(documentWidthFor(ReadingWidth.Standard)).toBe(
      EditorStyleHelper.documentWidth
    );
  });

  it("orders narrow, standard, wide", () => {
    const em = (value: string) => parseFloat(value);
    expect(em(documentWidthFor(ReadingWidth.Narrow))).toBeLessThan(
      em(documentWidthFor(ReadingWidth.Standard))
    );
    expect(em(documentWidthFor(ReadingWidth.Standard))).toBeLessThan(
      em(documentWidthFor(ReadingWidth.Wide))
    );
  });

  it("returns every width in the same unit", () => {
    for (const width of Object.values(ReadingWidth)) {
      expect(documentWidthFor(width)).toMatch(/^[\d.]+em$/);
    }
  });

  it("falls back to the standard width when no preference is set", () => {
    expect(documentWidthFor()).toBe(documentWidthFor(ReadingWidth.Standard));
    expect(documentWidthFor(null)).toBe(documentWidthFor(ReadingWidth.Standard));
  });

  it("falls back to the standard width for an unrecognised value", () => {
    expect(documentWidthFor("enormous" as ReadingWidth)).toBe(
      documentWidthFor(ReadingWidth.Standard)
    );
  });
});
