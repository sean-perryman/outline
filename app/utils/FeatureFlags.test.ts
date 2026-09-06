import Storage from "@shared/utils/Storage";
import { Feature, FeatureFlags } from "./FeatureFlags";

// newCollectionSharing defaults to enabled, which is the case the disable path
// used to get wrong.
const flag = Feature.newCollectionSharing;

describe("FeatureFlags", () => {
  afterEach(() => {
    Storage.remove(flag);
  });

  it("returns the default when nothing is stored", () => {
    expect(FeatureFlags.isEnabled(flag)).toBe(true);
  });

  it("disables a flag that defaults to enabled", () => {
    FeatureFlags.disable(flag);
    expect(FeatureFlags.isEnabled(flag)).toBe(false);
  });

  it("re-enables a disabled flag", () => {
    FeatureFlags.disable(flag);
    FeatureFlags.enable(flag);
    expect(FeatureFlags.isEnabled(flag)).toBe(true);
  });

  it("persists an explicit disable to storage", () => {
    FeatureFlags.disable(flag);
    expect(Storage.get(flag)).toBe(false);
  });

  it("persists an explicit enable to storage", () => {
    FeatureFlags.enable(flag);
    expect(Storage.get(flag)).toBe(true);
  });

  it("is idempotent", () => {
    FeatureFlags.disable(flag);
    FeatureFlags.disable(flag);
    expect(FeatureFlags.isEnabled(flag)).toBe(false);

    FeatureFlags.enable(flag);
    FeatureFlags.enable(flag);
    expect(FeatureFlags.isEnabled(flag)).toBe(true);
  });
});
