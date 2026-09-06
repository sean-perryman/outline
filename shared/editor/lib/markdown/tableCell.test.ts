import { escapeRawTableCell, unescapeRawTableCell } from "./tableCell";

describe("escapeRawTableCell", () => {
  it("escapes the cell delimiter", () => {
    expect(escapeRawTableCell("a | b")).toBe("a \\| b");
  });

  it("escapes the escape character itself", () => {
    expect(escapeRawTableCell("a \\ b")).toBe("a \\\\ b");
  });

  it("escapes both in a single pass, so a backslash before a pipe survives", () => {
    expect(escapeRawTableCell("\\|")).toBe("\\\\\\|");
  });

  it("leaves content with neither character alone", () => {
    expect(escapeRawTableCell("const x = 1;")).toBe("const x = 1;");
  });

  it("leaves an empty string alone", () => {
    expect(escapeRawTableCell("")).toBe("");
  });
});

describe("unescapeRawTableCell", () => {
  it("reverses an escaped delimiter", () => {
    expect(unescapeRawTableCell("a \\| b")).toBe("a | b");
  });

  it("reverses an escaped backslash", () => {
    expect(unescapeRawTableCell("a \\\\ b")).toBe("a \\ b");
  });

  it("leaves an escape of any other character alone", () => {
    expect(unescapeRawTableCell("\\n")).toBe("\\n");
  });
});

describe("round trip", () => {
  const cases = [
    "const x = 1;",
    "a | b",
    "a \\ b",
    "\\|",
    "|\\",
    "\\\\||\\\\",
    "x |> y",
    "",
    "||||",
    "\\\\\\",
  ];

  it.each(cases)("survives escape then unescape: %j", (raw) => {
    expect(unescapeRawTableCell(escapeRawTableCell(raw))).toBe(raw);
  });

  it("never leaves a bare delimiter in the escaped form", () => {
    for (const raw of cases) {
      const escaped = escapeRawTableCell(raw);
      // Every pipe in the escaped output must be preceded by an odd number of
      // backslashes, otherwise it would break out of the table column.
      for (let i = 0; i < escaped.length; i++) {
        if (escaped[i] !== "|") {
          continue;
        }
        let backslashes = 0;
        for (let j = i - 1; j >= 0 && escaped[j] === "\\"; j--) {
          backslashes++;
        }
        expect(backslashes % 2).toBe(1);
      }
    }
  });
});
