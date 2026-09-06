import type { EmbedDescriptor } from "../embeds";
import { getMatchingEmbed } from "./embeds";

const descriptor = (matcher: EmbedDescriptor["matcher"], title: string) =>
  ({ matcher, title }) as EmbedDescriptor;

describe("getMatchingEmbed", () => {
  const vimeo = descriptor(
    (href: string) => href.match(/vimeo\.com\/(\d+)/),
    "Vimeo"
  );
  const youtube = descriptor(
    (href: string) => href.match(/youtube\.com\/watch\?v=(\w+)/),
    "YouTube"
  );

  it("returns the descriptor whose matcher accepts the href", () => {
    const result = getMatchingEmbed([vimeo, youtube], "https://vimeo.com/1234");
    expect(result?.embed).toBe(vimeo);
  });

  it("returns the matches from the matcher", () => {
    const result = getMatchingEmbed([vimeo, youtube], "https://vimeo.com/1234");
    expect(result?.matches[1]).toBe("1234");
  });

  it("returns undefined when nothing matches", () => {
    expect(
      getMatchingEmbed([vimeo, youtube], "https://example.com")
    ).toBeUndefined();
  });

  it("returns undefined for an empty list of embeds", () => {
    expect(getMatchingEmbed([], "https://vimeo.com/1234")).toBeUndefined();
  });

  it("returns the first match when more than one would accept the href", () => {
    const catchAll = descriptor((href: string) => href.match(/.*/), "Catch all");
    expect(getMatchingEmbed([catchAll, vimeo], "https://vimeo.com/1234")?.embed).toBe(
      catchAll
    );
    expect(getMatchingEmbed([vimeo, catchAll], "https://vimeo.com/1234")?.embed).toBe(
      vimeo
    );
  });

  it("skips a matcher that returns a falsy result", () => {
    const never = descriptor(() => null, "Never");
    expect(getMatchingEmbed([never, vimeo], "https://vimeo.com/1234")?.embed).toBe(
      vimeo
    );
  });
});
