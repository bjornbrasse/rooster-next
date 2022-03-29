import { PrismaClient, User } from '@prisma/client';
import { adminUserData, usersData } from './data';

export type NewAdminUserData = {
  role: string;
  firstName: string;
  lastName: string;
  initials: string;
  email: string;
  passwordHash: string;
};

export type NewUserData = Pick<
  User,
  'firstName' | 'lastName' | 'initials' | 'email' | 'passwordHash'
> & {
  organisationSlug: string;
  defaultDepartmentSlug: string;
  // defaultTeamSlug: string;
} & Partial<User>;

export async function seedAdminUser({
  db,
}: {
  db: PrismaClient;
}): Promise<User> {
  const data = await adminUserData();

  return await db.user.create({
    data,
  });
}

export async function seedUsers({
  db,
  adminUser,
}: {
  db: PrismaClient;
  adminUser: User;
}): Promise<User[]> {
  const newUsers: NewUserData[] = await usersData();

  const res = await Promise.all(
    newUsers.map((newUser) => {
      return db.user.create({
        data: newUser,
      });
    }),
  );

  console.log('PA', res.values);

  return [adminUser];
}
