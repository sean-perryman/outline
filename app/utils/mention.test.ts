import { IntegrationService } from "@shared/types";
import type Integration from "~/models/Integration";
import { isURLMentionable } from "./mention";

const integration = (
  service: IntegrationService,
  settings: Record<string, unknown> = {}
) => ({ service, settings }) as unknown as Integration;

const check = (url: string, target: Integration) =>
  isURLMentionable({ url: new URL(url), integration: target });

describe("isURLMentionable — GitHub", () => {
  const github = integration(IntegrationService.GitHub);

  it("accepts any github.com url", () => {
    expect(check("https://github.com/outline/outline/pull/1", github)).toBe(
      true
    );
    expect(check("https://github.com/outline", github)).toBe(true);
  });

  it("rejects other hosts", () => {
    expect(check("https://gitlab.com/outline/outline", github)).toBe(false);
    expect(check("https://notgithub.com/a/b", github)).toBe(false);
  });

  it("rejects a subdomain of github.com", () => {
    expect(check("https://gist.github.com/a/b", github)).toBe(false);
  });
});

describe("isURLMentionable — Linear", () => {
  const linear = integration(IntegrationService.Linear, {
    linear: { workspace: { key: "acme" } },
  });

  it("accepts a url in the installed workspace", () => {
    expect(check("https://linear.app/acme/issue/ENG-1", linear)).toBe(true);
  });

  it("rejects a url in a different workspace", () => {
    expect(check("https://linear.app/other/issue/ENG-1", linear)).toBe(false);
  });

  it("rejects other hosts", () => {
    expect(check("https://example.com/acme/issue/ENG-1", linear)).toBe(false);
  });

  it("rejects when no workspace is configured", () => {
    const unconfigured = integration(IntegrationService.Linear, {});
    expect(check("https://linear.app/acme/issue/ENG-1", unconfigured)).toBe(
      false
    );
  });
});

describe("isURLMentionable — GitLab", () => {
  it("rejects a url when the stored instance url is not parseable", () => {
    const broken = integration(IntegrationService.GitLab, {
      gitlab: { url: "not a url" },
    });
    expect(check("https://gitlab.com/acme/repo", broken)).toBe(false);
  });
});
