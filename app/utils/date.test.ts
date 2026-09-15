import { dateToExpiry, dateToHeading } from "./date";

// Stands in for i18next: returns the key with any interpolation applied, so a
// test can tell "Expires {{ date }}" apart from "Expires tomorrow".
const t = ((key: string, values?: Record<string, string>) =>
  values
    ? key.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name: string) => values[name])
    : key) as never;

const at = (offsetDays: number, hour = 12) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

describe("dateToHeading", () => {
  it("names today and yesterday", () => {
    expect(dateToHeading(at(0), t, undefined)).toBe("Today");
    expect(dateToHeading(at(-1), t, undefined)).toBe("Yesterday");
  });

  it("names a much older date by its year", () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 3);
    expect(dateToHeading(date.toISOString(), t, undefined)).toBe(
      String(date.getFullYear())
    );
  });

  it("does not fall through to a year for a recent date", () => {
    const heading = dateToHeading(at(-40), t, undefined);
    expect(heading).not.toMatch(/^\d{4}$/);
  });

  it("returns a non-empty heading for every offset in the last two years", () => {
    for (const offset of [0, -1, -3, -8, -20, -45, -200, -400, -700]) {
      expect(dateToHeading(at(offset), t, undefined)).toBeTruthy();
    }
  });
});

describe("dateToExpiry", () => {
  it("reports a date that has not arrived yet as expiring", () => {
    expect(dateToExpiry(at(1), t, undefined)).toBe("Expires tomorrow");
  });

  it("reports yesterday as expired", () => {
    expect(dateToExpiry(at(-1), t, undefined)).toBe("Expired yesterday");
  });

  it("names a far future date rather than a weekday", () => {
    expect(dateToExpiry(at(60), t, undefined)).toMatch(
      /^Expires [A-Z][a-z]{2} \d{2}, \d{4}$/
    );
  });

  it("names a far past date rather than a weekday", () => {
    expect(dateToExpiry(at(-60), t, undefined)).toMatch(
      /^Expired [A-Z][a-z]{2} \d{2}, \d{4}$/
    );
  });

  it("checks isPast before isToday, so an earlier hour today reads as expired", () => {
    // Worth pinning: the ordering means a token expiring at 00:01 today is
    // described as expired rather than as expiring today. That is correct — it
    // has expired — but it is decided by branch order rather than explicitly.
    const earlierToday = new Date();
    earlierToday.setHours(0, 1, 0, 0);
    expect(dateToExpiry(earlierToday.toISOString(), t, undefined)).toMatch(
      /^Expired /
    );
  });
});
