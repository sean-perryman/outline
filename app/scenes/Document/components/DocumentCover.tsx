import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { colorPalette } from "@shared/constants";

type Props = {
  /** Identifier of the document, used to pick a stable fallback colour. */
  documentId: string;
  /** The document's icon colour, when the author has chosen one. */
  color?: string | null;
};

/**
 * Picks a stable palette entry from the document identifier so that a document
 * with no icon colour still gets a consistent cover rather than a grey one.
 *
 * @param documentId The document identifier.
 * @returns A hex colour drawn from the shared palette.
 */
function fallbackColor(documentId: string): string {
  let hash = 0;
  for (let i = 0; i < documentId.length; i++) {
    hash = (hash * 31 + documentId.charCodeAt(i)) | 0;
  }
  return colorPalette[Math.abs(hash) % colorPalette.length] ?? colorPalette[0];
}

/**
 * A decorative header band above the document title, tinted with the document's
 * own icon colour. Purely presentational — it carries no information that is not
 * already on the page, so it is hidden from assistive technology and from print.
 */
function DocumentCover({ documentId, color }: Props) {
  const resolved = color ?? fallbackColor(documentId);
  return <Cover $color={resolved} aria-hidden />;
}

const Cover = styled.div<{ $color: string }>`
  height: 132px;
  margin-top: 24px;
  border-radius: 8px;
  flex-shrink: 0;
  background: linear-gradient(
    160deg,
    ${(props) => props.$color} 0%,
    ${(props) => props.$color}66 55%,
    ${(props) => props.$color}14 100%
  );

  @media print {
    display: none;
  }
`;

export default observer(DocumentCover);
