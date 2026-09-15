import { sleep } from "./timers";

describe("sleep", () => {
  it("resolves after roughly the requested delay", async () => {
    const before = Date.now();
    await sleep(25);
    expect(Date.now() - before).toBeGreaterThanOrEqual(20);
  });

  it("defaults to a one millisecond delay", async () => {
    await expect(sleep()).resolves.toBeUndefined();
  });

  it("resolves rather than rejecting for a zero delay", async () => {
    await expect(sleep(0)).resolves.toBeUndefined();
  });
});
