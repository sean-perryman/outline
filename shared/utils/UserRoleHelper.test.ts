import { UserRole } from "../types";
import { UserRoleHelper } from "./UserRoleHelper";

const t = ((key: string) => key) as never;

describe("UserRoleHelper.displayName", () => {
  it("names every role", () => {
    expect(UserRoleHelper.displayName(UserRole.Guest, t)).toBe("Guest");
    expect(UserRoleHelper.displayName(UserRole.Viewer, t)).toBe("Viewer");
    expect(UserRoleHelper.displayName(UserRole.Admin, t)).toBe("Admin");
  });

  it("displays the Member role as Editor", () => {
    expect(UserRoleHelper.displayName(UserRole.Member, t)).toBe("Editor");
  });
});

describe("role ordering", () => {
  it("orders guest below viewer below member below admin", () => {
    expect(UserRoleHelper.isRoleHigher(UserRole.Viewer, UserRole.Guest)).toBe(
      true
    );
    expect(UserRoleHelper.isRoleHigher(UserRole.Member, UserRole.Viewer)).toBe(
      true
    );
    expect(UserRoleHelper.isRoleHigher(UserRole.Admin, UserRole.Member)).toBe(
      true
    );
  });

  it("is false for a role compared against itself", () => {
    expect(UserRoleHelper.isRoleHigher(UserRole.Member, UserRole.Member)).toBe(
      false
    );
    expect(UserRoleHelper.isRoleLower(UserRole.Member, UserRole.Member)).toBe(
      false
    );
  });

  it("makes isRoleLower the mirror of isRoleHigher", () => {
    expect(UserRoleHelper.isRoleLower(UserRole.Guest, UserRole.Admin)).toBe(
      true
    );
    expect(UserRoleHelper.isRoleLower(UserRole.Admin, UserRole.Guest)).toBe(
      false
    );
  });
});

describe("canPromote / canDemote", () => {
  it("allows promoting a user to a higher role", () => {
    expect(
      UserRoleHelper.canPromote({ role: UserRole.Viewer }, UserRole.Admin)
    ).toBe(true);
  });

  it("refuses to promote a user to their own role", () => {
    expect(
      UserRoleHelper.canPromote({ role: UserRole.Admin }, UserRole.Admin)
    ).toBe(false);
  });

  it("refuses to promote a user to a lower role", () => {
    expect(
      UserRoleHelper.canPromote({ role: UserRole.Admin }, UserRole.Viewer)
    ).toBe(false);
  });

  it("allows demoting a user to a lower role", () => {
    expect(
      UserRoleHelper.canDemote({ role: UserRole.Admin }, UserRole.Viewer)
    ).toBe(true);
  });

  it("refuses to demote a user to their own or a higher role", () => {
    expect(
      UserRoleHelper.canDemote({ role: UserRole.Viewer }, UserRole.Viewer)
    ).toBe(false);
    expect(
      UserRoleHelper.canDemote({ role: UserRole.Viewer }, UserRole.Admin)
    ).toBe(false);
  });
});
