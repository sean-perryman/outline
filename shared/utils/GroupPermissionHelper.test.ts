import { GroupPermission } from "../types";
import { GroupPermissionHelper } from "./GroupPermissionHelper";

const t = ((key: string) => key) as never;

describe("GroupPermissionHelper.displayName", () => {
  it("names every permission", () => {
    expect(GroupPermissionHelper.displayName(GroupPermission.Admin, t)).toBe(
      "Group admin"
    );
    expect(GroupPermissionHelper.displayName(GroupPermission.Member, t)).toBe(
      "Member"
    );
  });

  it("names every permission it lists", () => {
    for (const permission of GroupPermissionHelper.permissions) {
      expect(GroupPermissionHelper.displayName(permission, t)).toBeTruthy();
    }
  });
});

describe("GroupPermissionHelper.permissions", () => {
  it("is ordered from lowest to highest", () => {
    expect(GroupPermissionHelper.permissions).toEqual([
      GroupPermission.Member,
      GroupPermission.Admin,
    ]);
  });

  it("covers every value of the enum", () => {
    expect([...GroupPermissionHelper.permissions].sort()).toEqual(
      Object.values(GroupPermission).sort()
    );
  });
});
