import { altDisplay, ctrlDisplay, metaDisplay, normalizeKeyDisplay } from "./keyboard";

// The display strings are chosen at import time from the platform, so these
// assertions compare against the exported constants rather than hard-coding
// either platform's symbols.
describe("normalizeKeyDisplay", () => {
  it("unwraps a KeyX code to its letter, preserving the letter's case", () => {
    expect(normalizeKeyDisplay("KeyA")).toBe("A");
    expect(normalizeKeyDisplay("Keya")).toBe("a");
  });

  it("uppercases a letter when asked", () => {
    expect(normalizeKeyDisplay("Keya", true)).toBe("A");
    expect(normalizeKeyDisplay("a", true)).toBe("A");
  });

  it("leaves a single letter alone when not asked to uppercase", () => {
    expect(normalizeKeyDisplay("a")).toBe("a");
  });

  it("substitutes the platform modifier symbols", () => {
    expect(normalizeKeyDisplay("Meta")).toBe(metaDisplay);
    expect(normalizeKeyDisplay("Cmd")).toBe(metaDisplay);
    expect(normalizeKeyDisplay("Alt")).toBe(altDisplay);
    expect(normalizeKeyDisplay("Control")).toBe(ctrlDisplay);
  });

  it("always renders shift as its symbol", () => {
    expect(normalizeKeyDisplay("Shift")).toBe("⇧");
  });

  it("substitutes case insensitively", () => {
    expect(normalizeKeyDisplay("shift")).toBe("⇧");
    expect(normalizeKeyDisplay("alt")).toBe(altDisplay);
  });

  it("leaves keys it does not recognise untouched", () => {
    expect(normalizeKeyDisplay("Enter")).toBe("Enter");
    expect(normalizeKeyDisplay("Escape")).toBe("Escape");
  });

  it("only unwraps KeyX when it is the whole string", () => {
    expect(normalizeKeyDisplay("KeyAB")).toBe("KeyAB");
  });
});
