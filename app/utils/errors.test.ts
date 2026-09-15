import {
  AuthorizationError,
  BadGatewayError,
  BadRequestError,
  ClientClosedRequestError,
  NetworkError,
  NotFoundError,
  OfflineError,
  PaymentRequiredError,
  RateLimitExceededError,
  RequestError,
  ServiceUnavailableError,
  UnprocessableEntityError,
  UpdateRequiredError,
} from "./errors";

const errors = [
  [AuthorizationError, "AuthorizationError"],
  [BadRequestError, "BadRequestError"],
  [NetworkError, "NetworkError"],
  [NotFoundError, "NotFoundError"],
  [PaymentRequiredError, "PaymentRequiredError"],
  [OfflineError, "OfflineError"],
  [ServiceUnavailableError, "ServiceUnavailableError"],
  [BadGatewayError, "BadGatewayError"],
  [UnprocessableEntityError, "UnprocessableEntityError"],
  [RateLimitExceededError, "RateLimitExceededError"],
  [ClientClosedRequestError, "ClientClosedRequestError"],
  [RequestError, "RequestError"],
  [UpdateRequiredError, "UpdateRequiredError"],
] as const;

describe("api errors", () => {
  it.each(errors)("%o carries its own name", (Ctor, name) => {
    // The name is assigned explicitly rather than inherited from the
    // constructor name, which the production build mangles to a single letter.
    expect(new Ctor("boom").name).toBe(name);
  });

  it.each(errors)("%o is an Error", (Ctor) => {
    const error = new Ctor("boom");
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe("boom");
  });

  it.each(errors)("%o is distinguishable by instanceof", (Ctor) => {
    expect(new Ctor("boom")).toBeInstanceOf(Ctor);
  });

  it("does not confuse one error type for another", () => {
    expect(new NotFoundError("boom")).not.toBeInstanceOf(AuthorizationError);
    expect(new AuthorizationError("boom")).not.toBeInstanceOf(NotFoundError);
  });

  it("gives every error a distinct name", () => {
    const names = errors.map(([, name]) => name);
    expect(new Set(names).size).toBe(names.length);
  });
});
