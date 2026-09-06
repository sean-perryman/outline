import { download } from "./download";

describe("download", () => {
  let created: string[];
  let revoked: string[];
  let clicked: HTMLAnchorElement[];

  beforeEach(() => {
    created = [];
    revoked = [];
    clicked = [];
    vi.useFakeTimers();

    URL.createObjectURL = vi.fn(() => {
      const url = `blob:test/${created.length}`;
      created.push(url);
      return url;
    });
    URL.revokeObjectURL = vi.fn((url: string) => {
      revoked.push(url);
    });

    // jsdom does not implement navigation, so record the click instead.
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
      function (this: HTMLAnchorElement) {
        clicked.push(this);
      }
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("clicks an anchor carrying the object url and file name", () => {
    download("hello", "notes.txt", "text/plain");

    expect(clicked).toHaveLength(1);
    expect(clicked[0].download).toBe("notes.txt");
    expect(clicked[0].href).toContain(created[0]);
  });

  it("removes the anchor from the document again", () => {
    download("hello", "notes.txt");

    expect(document.body.contains(clicked[0])).toBe(false);
  });

  it("passes a Blob through rather than re-wrapping it", async () => {
    const blob = new Blob(["hello"], { type: "text/plain" });
    download(blob, "notes.txt");

    expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
  });

  it("falls back to a default file name", () => {
    download("hello", "");

    expect(clicked[0].download).toBe("download");
  });

  it("revokes the object url, but not before the click", () => {
    download("hello", "notes.txt");

    expect(revoked).toEqual([]);

    vi.runAllTimers();

    expect(revoked).toEqual([created[0]]);
  });
});
