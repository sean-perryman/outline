import isTextInput from "./isTextInput";

const element = (html: string): Element => {
  const container = document.createElement("div");
  container.innerHTML = html;
  return container.firstElementChild as Element;
};

describe("isTextInput", () => {
  it("recognises the form elements by tag name", () => {
    expect(isTextInput(element("<input />"))).toBe(true);
    expect(isTextInput(element("<textarea></textarea>"))).toBe(true);
    expect(isTextInput(element("<select></select>"))).toBe(true);
    expect(isTextInput(element("<button></button>"))).toBe(true);
  });

  it("recognises an element with a textbox role", () => {
    expect(isTextInput(element('<div role="textbox"></div>'))).toBe(true);
  });

  it("recognises a contenteditable element", () => {
    expect(isTextInput(element('<div contenteditable="true"></div>'))).toBe(
      true
    );
  });

  it("does not treat contenteditable=false as an input", () => {
    expect(isTextInput(element('<div contenteditable="false"></div>'))).toBe(
      false
    );
  });

  it("does not treat other roles as an input", () => {
    expect(isTextInput(element('<div role="button"></div>'))).toBe(false);
  });

  it("returns false for ordinary elements", () => {
    expect(isTextInput(element("<div></div>"))).toBe(false);
    expect(isTextInput(element("<span></span>"))).toBe(false);
    expect(isTextInput(element("<a></a>"))).toBe(false);
  });

  it("returns false when given nothing", () => {
    expect(isTextInput(null as unknown as Element)).toBe(false);
    expect(isTextInput(undefined as unknown as Element)).toBe(false);
  });
});
