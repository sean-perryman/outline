import { makeObservable, observable, runInAction } from "mobx";
import Storage from "@shared/utils/Storage";

/**
 * Available feature flags that can be toggled per-client.
 */
export enum Feature {
  /** New collection permissions UI */
  newCollectionSharing = "newCollectionSharing",
}

/** Default values for feature flags */
const FeatureDefaults: Record<Feature, boolean> = {
  [Feature.newCollectionSharing]: true,
};

/**
 * A simple feature flagging system that stores flags in browser storage.
 */
export class FeatureFlags {
  /**
   * Checks whether a feature flag is currently enabled.
   *
   * @param flag the feature flag to check.
   * @returns true if the flag is enabled.
   */
  public static isEnabled(flag: Feature) {
    // init on first read
    if (this.initalized === false) {
      runInAction(() => {
        this.cache = new Map();
        for (const key of Object.values(Feature)) {
          const value = Storage.get(key);
          // Both values are meaningful: a stored `false` is an explicit opt-out
          // and must win over a default of `true`.
          if (typeof value === "boolean") {
            this.cache.set(key, value);
          }
        }
        this.initalized = true;
      });
    }

    return this.cache.get(flag) ?? FeatureDefaults[flag] ?? false;
  }

  /**
   * Enables a feature flag and persists the value to browser storage.
   *
   * @param flag the feature flag to enable.
   */
  public static enable(flag: Feature) {
    runInAction(() => {
      this.cache.set(flag, true);
    });
    Storage.set(flag, true);
  }

  /**
   * Disables a feature flag and persists the value to browser storage.
   *
   * @param flag the feature flag to disable.
   */
  public static disable(flag: Feature) {
    runInAction(() => {
      this.cache.set(flag, false);
    });
    Storage.set(flag, false);
  }

  @observable
  private static cache: Map<Feature, boolean> = new Map();

  private static initalized = false;
}

makeObservable(FeatureFlags);
