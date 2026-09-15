import { Pointer } from "./pointer";

describe("Pointer.fromJSON", () => {
  it("splits a path into tokens", () => {
    expect(Pointer.fromJSON("/a/b").tokens).toEqual(["", "a", "b"]);
  });

  it("represents the whole document as a single empty token", () => {
    expect(Pointer.fromJSON("").tokens).toEqual([""]);
  });

  it("rejects a path that does not begin with a separator", () => {
    expect(() => Pointer.fromJSON("a/b")).toThrow(/Invalid JSON Pointer/);
  });

  it("unescapes a separator inside a token", () => {
    expect(Pointer.fromJSON("/a~1b").tokens).toEqual(["", "a/b"]);
  });

  it("unescapes an escape character inside a token", () => {
    expect(Pointer.fromJSON("/a~0b").tokens).toEqual(["", "a~b"]);
  });

  it("unescapes in the order RFC 6902 requires", () => {
    // ~01 must become ~1, not /. Unescaping ~0 first would produce ~1 and then
    // a second pass would wrongly turn it into a separator.
    expect(Pointer.fromJSON("/a~01b").tokens).toEqual(["", "a~1b"]);
  });
});

describe("Pointer.toString", () => {
  it("is the inverse of fromJSON", () => {
    for (const path of ["", "/a", "/a/b", "/a~1b", "/a~0b", "/a~01b", "/"]) {
      expect(Pointer.fromJSON(path).toString()).toBe(path);
    }
  });

  it("escapes both special characters in a token", () => {
    expect(new Pointer(["", "a~b/c"]).toString()).toBe("/a~0b~1c");
  });
});

describe("Pointer.evaluate", () => {
  it("returns the whole document for the empty pointer", () => {
    const object = { a: 1 };
    expect(Pointer.fromJSON("").evaluate(object)).toEqual({
      parent: null,
      key: "",
      value: object,
    });
  });

  it("returns the parent and key alongside the value", () => {
    const object = { a: { b: 2 } };
    const result = Pointer.fromJSON("/a/b").evaluate(object);
    expect(result.value).toBe(2);
    expect(result.key).toBe("b");
    expect(result.parent).toBe(object.a);
  });

  it("indexes into arrays", () => {
    expect(Pointer.fromJSON("/a/1").get({ a: ["x", "y"] })).toBe("y");
  });

  it("returns undefined for a path that does not exist", () => {
    expect(Pointer.fromJSON("/a/b/c").get({ a: {} })).toBeUndefined();
  });

  it("refuses to walk into prototype-polluting keys", () => {
    for (const key of ["__proto__", "constructor", "prototype"]) {
      expect(Pointer.fromJSON(`/${key}`).get({})).toEqual({});
    }
  });
});

describe("Pointer.set", () => {
  it("writes a nested value", () => {
    const object = { a: { b: 1 } };
    Pointer.fromJSON("/a/b").set(object, 2);
    expect(object.a.b).toBe(2);
  });

  it("writes a top-level value", () => {
    const object: Record<string, unknown> = {};
    Pointer.fromJSON("/a").set(object, 1);
    expect(object.a).toBe(1);
  });

  it("does nothing when an intermediate path does not exist", () => {
    const object = {};
    expect(() => Pointer.fromJSON("/a/b/c").set(object, 1)).not.toThrow();
    expect(object).toEqual({});
  });
});

describe("Pointer.add and Pointer.push", () => {
  it("add returns a new pointer and leaves the original alone", () => {
    const pointer = Pointer.fromJSON("/a");
    const extended = pointer.add("b");
    expect(extended.toString()).toBe("/a/b");
    expect(pointer.toString()).toBe("/a");
  });

  it("add coerces its token to a string", () => {
    expect(Pointer.fromJSON("/a").add(1 as unknown as string).toString()).toBe(
      "/a/1"
    );
  });

  it("push mutates the pointer in place", () => {
    const pointer = Pointer.fromJSON("/a");
    pointer.push("b");
    expect(pointer.toString()).toBe("/a/b");
  });
});
