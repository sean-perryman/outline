import EventEmitter from "./events";

describe("EventEmitter", () => {
  it("calls a listener when its event is emitted", () => {
    const emitter = new EventEmitter();
    const calls: unknown[] = [];
    emitter.addListener("ping", (data) => calls.push(data));

    emitter.emit("ping", 1);

    expect(calls).toEqual([1]);
  });

  it("passes undefined when emitted without data", () => {
    const emitter = new EventEmitter();
    const calls: unknown[] = [];
    emitter.addListener("ping", (data) => calls.push(data));

    emitter.emit("ping");

    expect(calls).toEqual([undefined]);
  });

  it("calls every listener for an event, in the order added", () => {
    const emitter = new EventEmitter();
    const order: string[] = [];
    emitter.addListener("ping", () => order.push("first"));
    emitter.addListener("ping", () => order.push("second"));

    emitter.emit("ping");

    expect(order).toEqual(["first", "second"]);
  });

  it("does not call listeners registered for other events", () => {
    const emitter = new EventEmitter();
    let called = false;
    emitter.addListener("ping", () => {
      called = true;
    });

    emitter.emit("pong");

    expect(called).toBe(false);
  });

  it("does nothing when emitting an event with no listeners", () => {
    const emitter = new EventEmitter();
    expect(() => emitter.emit("nobody-listening")).not.toThrow();
  });

  it("removes a listener by reference", () => {
    const emitter = new EventEmitter();
    let count = 0;
    const listener = () => {
      count++;
    };
    emitter.addListener("ping", listener);
    emitter.emit("ping");
    emitter.removeListener("ping", listener);
    emitter.emit("ping");

    expect(count).toBe(1);
  });

  it("leaves other listeners in place when one is removed", () => {
    const emitter = new EventEmitter();
    const order: string[] = [];
    const removed = () => order.push("removed");
    emitter.addListener("ping", removed);
    emitter.addListener("ping", () => order.push("kept"));

    emitter.removeListener("ping", removed);
    emitter.emit("ping");

    expect(order).toEqual(["kept"]);
  });

  it("tolerates removing a listener that was never added", () => {
    const emitter = new EventEmitter();
    expect(() => emitter.removeListener("ping", () => undefined)).not.toThrow();
  });

  it("exposes on and off as aliases of addListener and removeListener", () => {
    const emitter = new EventEmitter();
    let count = 0;
    const listener = () => {
      count++;
    };

    emitter.on("ping", listener);
    emitter.emit("ping");
    emitter.off("ping", listener);
    emitter.emit("ping");

    expect(count).toBe(1);
  });

  it("keeps listeners on separate emitter instances apart", () => {
    const first = new EventEmitter();
    const second = new EventEmitter();
    let called = false;
    first.addListener("ping", () => {
      called = true;
    });

    second.emit("ping");

    expect(called).toBe(false);
  });
});
