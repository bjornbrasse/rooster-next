import { User } from '@prisma/client';

export type WithFullName<T> = T & {
  fullName: string;
  initials: string;
};

export function userWithFullName<
  User extends { firstName: string; lastName: string },
>(user: User): WithFullName<User> {
  // if (!user) return null;

  return {
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
    initials:
      user.firstName.charAt(0).toUpperCase() +
      user.lastName.charAt(0).toUpperCase(),
  };
}
