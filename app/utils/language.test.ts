import { detectLanguage } from "./language";

const withNavigatorLanguage = (value: string, fn: () => void) => {
  const descriptor = Object.getOwnPropertyDescriptor(
    window.navigator,
    "language"
  );
  Object.defineProperty(window.navigator, "language", {
    value,
    configurable: true,
  });
  try {
    fn();
  } finally {
    if (descriptor) {
      Object.defineProperty(window.navigator, "language", descriptor);
    }
  }
};

describe("detectLanguage", () => {
  it("converts a BCP47 tag to the CLDR form stored in the database", () => {
    withNavigatorLanguage("en-US", () => {
      expect(detectLanguage()).toBe("en_US");
    });
  });

  it("uppercases the region", () => {
    withNavigatorLanguage("pt-br", () => {
      expect(detectLanguage()).toBe("pt_BR");
    });
  });

  it("repeats the language as the region when the tag has none", () => {
    withNavigatorLanguage("de", () => {
      expect(detectLanguage()).toBe("de_DE");
    });
  });

  it("keeps the language subtag lowercase", () => {
    withNavigatorLanguage("FR-fr", () => {
      expect(detectLanguage()).toBe("FR_FR");
    });
  });

  it("always returns a value containing a separator", () => {
    for (const tag of ["en-US", "de", "zh-CN", "pt-br"]) {
      withNavigatorLanguage(tag, () => {
        expect(detectLanguage()).toContain("_");
      });
    }
  });
});
