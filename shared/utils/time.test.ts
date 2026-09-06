import { Day, Hour, Minute, Second, Week } from "./time";

describe("time units", () => {
  it("defines a second in milliseconds", () => {
    expect(Second.ms).toBe(1000);
  });

  it("builds each unit from the one below it", () => {
    expect(Minute.ms).toBe(60 * Second.ms);
    expect(Hour.ms).toBe(60 * Minute.ms);
    expect(Day.ms).toBe(24 * Hour.ms);
    expect(Week.ms).toBe(7 * Day.ms);
  });

  it("keeps the second-based counts consistent with the millisecond ones", () => {
    expect(Minute.seconds * Second.ms).toBe(Minute.ms);
    expect(Hour.seconds * Second.ms).toBe(Hour.ms);
    expect(Day.seconds * Second.ms).toBe(Day.ms);
    expect(Week.seconds * Second.ms).toBe(Week.ms);
  });

  it("keeps the minute-based counts consistent with the millisecond ones", () => {
    expect(Hour.minutes * Minute.ms).toBe(Hour.ms);
    expect(Day.minutes * Minute.ms).toBe(Day.ms);
    expect(Week.minutes * Minute.ms).toBe(Week.ms);
  });

  it("defines a week in days", () => {
    expect(Week.days).toBe(7);
    expect(Week.days * Day.ms).toBe(Week.ms);
  });
});
