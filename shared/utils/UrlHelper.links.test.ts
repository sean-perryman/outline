import { UrlHelper } from "./UrlHelper";

const links = {
  github: UrlHelper.github,
  twitter: UrlHelper.twitter,
  contact: UrlHelper.contact,
  developers: UrlHelper.developers,
  changelog: UrlHelper.changelog,
  guide: UrlHelper.guide,
};

const entries = Object.entries(links);

describe("outbound links", () => {
  it.each(entries)("%s is a parseable absolute url", (_name, href) => {
    expect(() => new URL(href)).not.toThrow();
  });

  it.each(entries)("%s is https", (_name, href) => {
    expect(new URL(href).protocol).toBe("https:");
  });

  it.each(entries)("%s has no trailing slash to double up on", (_name, href) => {
    expect(href.endsWith("/")).toBe(false);
  });

  it("points at the canonical github host, which does not redirect", () => {
    expect(new URL(UrlHelper.github).hostname).toBe("github.com");
  });

  it("points the issues link at this repository", () => {
    expect(new URL(UrlHelper.github).pathname).toBe("/outline/outline/issues");
  });
});
