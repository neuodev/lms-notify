import { User, FilterState } from "./types";
import { UserUtils } from "./utils";

export class UserFilter {
  static filterUsers(
    users: User[],
    filters: FilterState,
    searchTerm: string,
  ): User[] {
    return users.filter((user) => {
      // Filter by role
      if (filters.roleId !== null) {
        const userRoleId = UserUtils.getRoleId(user);
        if (userRoleId !== filters.roleId) {
          return false;
        }
      }

      // Filter by level (only for students and parents)
      if (filters.level !== null) {
        const userRoleId = UserUtils.getRoleId(user);
        const rolesWithLevels = [3, 7]; // Student, Parent

        if (userRoleId && rolesWithLevels.includes(userRoleId)) {
          if (user.level !== filters.level) {
            return false;
          }
        } else {
          return false;
        }
      }

      // Filter by phone number
      if (filters.hasPhoneOnly && !UserUtils.hasPhone(user)) {
        return false;
      }

      // Filter by search text
      if (searchTerm.trim()) {
        const fullName = (
          user.fullname || `${user.firstname || ""} ${user.lastname || ""}`
        ).toLowerCase();
        if (!fullName.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }

  static getTotalUsersWithPhone(users: User[]): number {
    return users.filter((user) => UserUtils.hasPhone(user)).length;
  }
}
