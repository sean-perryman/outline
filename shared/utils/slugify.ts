import slug from "slug";

slug.defaults.mode = "rfc3986";

/**
 * Convert a string to a slug that can be used in a URL in kebab-case format,
 * and remove periods.
 *
 * Returns an empty string when the input has no letters or digits to slug.
 * Without that guard the underlying `slug` package does not return an empty
 * string either — it falls back to a base-36 encoding of the input's character
 * codes, so a title made only of punctuation or an emoji produces a slug that
 * looks like line noise rather than no slug at all.
 *
 * @param text The text to convert
 * @returns The slugified text, or an empty string if there is nothing to slug
 */
export default function slugify(text: string): string {
  if (!/[\p{L}\p{N}]/u.test(text)) {
    return "";
  }

  return slug(text, {
    remove: /[.]/g,
  });
}
