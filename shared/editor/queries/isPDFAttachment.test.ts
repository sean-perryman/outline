import type { Node as ProsemirrorNode } from "prosemirror-model";
import { isPDFAttachment } from "./isPDFAttachment";

/** The query only reads attrs, so a minimal stand-in is enough. */
const attachment = (attrs: Record<string, unknown>) =>
  ({ attrs }) as unknown as ProsemirrorNode;

describe("isPDFAttachment", () => {
  it("uses the content type when the attachment has one", () => {
    expect(isPDFAttachment(attachment({ contentType: "application/pdf" }))).toBe(
      true
    );
    expect(isPDFAttachment(attachment({ contentType: "image/png" }))).toBe(
      false
    );
  });

  it("prefers the content type over the filename", () => {
    // A mislabelled filename must not override an explicit content type.
    expect(
      isPDFAttachment(
        attachment({ contentType: "image/png", title: "report.pdf" })
      )
    ).toBe(false);
  });

  it("falls back to the filename extension for older attachments", () => {
    // Attachments uploaded before PDF previews were introduced carry no
    // contentType attribute at all.
    expect(isPDFAttachment(attachment({ title: "report.pdf" }))).toBe(true);
    expect(isPDFAttachment(attachment({ title: "report.png" }))).toBe(false);
  });

  it("matches the extension case insensitively", () => {
    expect(isPDFAttachment(attachment({ title: "REPORT.PDF" }))).toBe(true);
    expect(isPDFAttachment(attachment({ title: "report.Pdf" }))).toBe(true);
  });

  it("only matches the extension, not a name containing pdf", () => {
    expect(isPDFAttachment(attachment({ title: "pdf-notes.txt" }))).toBe(false);
    expect(isPDFAttachment(attachment({ title: "report.pdf.zip" }))).toBe(false);
  });

  it("handles an attachment with neither attribute", () => {
    expect(isPDFAttachment(attachment({}))).toBe(false);
    expect(isPDFAttachment(attachment({ title: null }))).toBe(false);
  });
});
