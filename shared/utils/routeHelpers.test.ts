import {
  integrationSettingsPath,
  settingsPath,
  signin,
} from "./routeHelpers";

describe("signin", () => {
  it("defaults to slack", () => {
    expect(signin()).toBe("/auth/slack");
  });

  it("uses the given service", () => {
    expect(signin("google")).toBe("/auth/google");
    expect(signin("oidc")).toBe("/auth/oidc");
  });
});

describe("settingsPath", () => {
  it("returns the settings root with no section", () => {
    expect(settingsPath()).toBe("/settings");
  });

  it("appends a section", () => {
    expect(settingsPath("members")).toBe("/settings/members");
  });

  it("treats an empty section as no section", () => {
    expect(settingsPath("")).toBe("/settings");
  });

  it("does not double the separator", () => {
    expect(settingsPath("members").indexOf("//")).toBe(-1);
  });
});

describe("integrationSettingsPath", () => {
  it("nests under the settings root", () => {
    expect(integrationSettingsPath("slack")).toBe(
      "/settings/integrations/slack"
    );
  });

  it("agrees with settingsPath about where settings live", () => {
    expect(integrationSettingsPath("slack").startsWith(settingsPath())).toBe(
      true
    );
  });
});
