import { ReadingWidth } from "../types";
import { EditorStyleHelper } from "../editor/styles/EditorStyleHelper";

/**
 * The content column width for each reading width preference.
 *
 * Standard is the same value the editor has always used, so a reader who never
 * touches the preference sees no change.
 */
const widths: Record<ReadingWidth, string> = {
  [ReadingWidth.Narrow]: "40em",
  [ReadingWidth.Standard]: EditorStyleHelper.documentWidth,
  [ReadingWidth.Wide]: "68em",
};

/**
 * Resolves a reading width preference to a CSS length.
 *
 * @param width The preference, if the reader has expressed one.
 * @returns The content column width, falling back to the standard width.
 */
export function documentWidthFor(width?: ReadingWidth | null): string {
  return (width && widths[width]) || widths[ReadingWidth.Standard];
}
