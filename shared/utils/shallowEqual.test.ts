import shallowEqual from "./shallowEqual";

describe("shallowEqual", () => {
  it("returns true for the same array reference", () => {
    const array = [1, 2, 3];
    expect(shallowEqual(array, array)).toBe(true);
  });

  it("returns true for distinct arrays with identical elements", () => {
    expect(shallowEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it("returns true for two empty arrays", () => {
    expect(shallowEqual([], [])).toBe(true);
  });

  it("returns false when lengths differ", () => {
    expect(shallowEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it("returns false when order differs", () => {
    expect(shallowEqual([1, 2], [2, 1])).toBe(false);
  });

  it("compares by reference, not by value", () => {
    const a = { id: "a" };
    expect(shallowEqual([a], [a])).toBe(true);
    expect(shallowEqual([a], [{ id: "a" }])).toBe(false);
  });

  it("treats NaN as unequal, following strict equality", () => {
    expect(shallowEqual([NaN], [NaN])).toBe(false);
  });
});
