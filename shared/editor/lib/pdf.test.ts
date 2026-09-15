import {
  pdfNaturalHeight,
  pdfNaturalWidth,
  resolvePDFDimensions,
} from "./pdf";

const ratio = pdfNaturalHeight / pdfNaturalWidth;

describe("resolvePDFDimensions", () => {
  it("passes both dimensions through when both are stored", () => {
    expect(resolvePDFDimensions(400, 100)).toEqual({
      width: 400,
      height: 100,
    });
  });

  it("does not impose the natural ratio when both are stored", () => {
    // A stored pair that disagrees with the default ratio is still respected.
    const { width, height } = resolvePDFDimensions(400, 100);
    expect(height / width).not.toBeCloseTo(ratio);
  });

  it("derives the height from a stored width", () => {
    const { width, height } = resolvePDFDimensions(384);
    expect(width).toBe(384);
    expect(height).toBe(Math.round(384 * ratio));
  });

  it("derives the width from a stored height", () => {
    const { width, height } = resolvePDFDimensions(undefined, 543);
    expect(height).toBe(543);
    expect(width).toBe(Math.round(543 / ratio));
  });

  it("falls back to the natural size when neither is stored", () => {
    expect(resolvePDFDimensions()).toEqual({
      width: pdfNaturalWidth,
      height: pdfNaturalHeight,
    });
  });

  it("treats null the same as missing", () => {
    expect(resolvePDFDimensions(null, null)).toEqual({
      width: pdfNaturalWidth,
      height: pdfNaturalHeight,
    });
  });

  it("treats zero as missing, since a zero dimension is not renderable", () => {
    expect(resolvePDFDimensions(0, 0)).toEqual({
      width: pdfNaturalWidth,
      height: pdfNaturalHeight,
    });
    expect(resolvePDFDimensions(384, 0)).toEqual({
      width: 384,
      height: Math.round(384 * ratio),
    });
  });

  it("round-trips the natural size through either single dimension", () => {
    expect(resolvePDFDimensions(pdfNaturalWidth)).toEqual({
      width: pdfNaturalWidth,
      height: pdfNaturalHeight,
    });
    expect(resolvePDFDimensions(undefined, pdfNaturalHeight)).toEqual({
      width: pdfNaturalWidth,
      height: pdfNaturalHeight,
    });
  });

  it("returns whole pixels", () => {
    const { width, height } = resolvePDFDimensions(333);
    expect(Number.isInteger(width)).toBe(true);
    expect(Number.isInteger(height)).toBe(true);
  });
});
