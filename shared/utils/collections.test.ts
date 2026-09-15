import type { NavigationNode } from "../types";
import { sortNavigationNodes } from "./collections";

function node(
  title: string,
  children: NavigationNode[] = []
): NavigationNode {
  return { id: title, title, url: `/doc/${title}`, children };
}

describe("sortNavigationNodes", () => {
  it("returns the nodes untouched when sorting by index", () => {
    const nodes = [node("b"), node("a")];
    expect(sortNavigationNodes(nodes, { field: "index", direction: "asc" })).toBe(
      nodes
    );
  });

  it("sorts by the given field", () => {
    const nodes = [node("b"), node("a"), node("c")];
    const sorted = sortNavigationNodes(nodes, {
      field: "title",
      direction: "asc",
    });
    expect(sorted.map((n) => n.title)).toEqual(["a", "b", "c"]);
  });

  it("honours descending direction", () => {
    const nodes = [node("b"), node("a"), node("c")];
    const sorted = sortNavigationNodes(nodes, {
      field: "title",
      direction: "desc",
    });
    expect(sorted.map((n) => n.title)).toEqual(["c", "b", "a"]);
  });

  it("sorts children recursively", () => {
    const nodes = [node("a", [node("b"), node("a")])];
    const sorted = sortNavigationNodes(nodes, {
      field: "title",
      direction: "asc",
    });
    expect(sorted[0].children.map((n) => n.title)).toEqual(["a", "b"]);
  });

  it("leaves children alone when sortChildren is false", () => {
    const children = [node("b"), node("a")];
    const nodes = [node("a", children)];
    const sorted = sortNavigationNodes(
      nodes,
      { field: "title", direction: "asc" },
      false
    );
    expect(sorted[0].children).toBe(children);
  });

  it("preserves the node reference when its children did not move", () => {
    const unchanged = node("a", [node("a"), node("b")]);
    const sorted = sortNavigationNodes([unchanged], {
      field: "title",
      direction: "asc",
    });
    expect(sorted[0]).toBe(unchanged);
  });

  it("returns a new node when its children did move", () => {
    const changed = node("a", [node("b"), node("a")]);
    const sorted = sortNavigationNodes([changed], {
      field: "title",
      direction: "asc",
    });
    expect(sorted[0]).not.toBe(changed);
    expect(changed.children.map((n) => n.title)).toEqual(["b", "a"]);
  });
});
