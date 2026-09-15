import { getCookie, removeCookie } from "tiny-cookie";
import { generateOAuthStateNonce } from "./oauth";

const cookieName = "test.oauth.state";

describe("generateOAuthStateNonce", () => {
  afterEach(() => {
    removeCookie(cookieName);
  });

  it("returns a 32 character nonce", () => {
    expect(generateOAuthStateNonce(cookieName)).toHaveLength(32);
  });

  it("persists the nonce it returns in the named cookie", () => {
    const nonce = generateOAuthStateNonce(cookieName);
    expect(getCookie(cookieName)).toBe(nonce);
  });

  it("returns a different nonce each time", () => {
    const first = generateOAuthStateNonce(cookieName);
    const second = generateOAuthStateNonce(cookieName);
    expect(first).not.toBe(second);
  });

  it("overwrites any previous nonce, so only the latest is valid", () => {
    generateOAuthStateNonce(cookieName);
    const second = generateOAuthStateNonce(cookieName);
    expect(getCookie(cookieName)).toBe(second);
  });

  it("keeps separate providers' nonces apart", () => {
    const other = "test.oauth.state.other";
    const first = generateOAuthStateNonce(cookieName);
    const second = generateOAuthStateNonce(other);

    expect(getCookie(cookieName)).toBe(first);
    expect(getCookie(other)).toBe(second);

    removeCookie(other);
  });
});
