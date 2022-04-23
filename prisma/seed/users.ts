import { PrismaClient, User } from '@prisma/client';
import { usersData } from './data';

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
  // defaultDepartmentSlug: string;
  // defaultTeamSlug: string;
} & Partial<User>;

export async function seedAdminUser({
  db,
}: {
  db: PrismaClient;
}): Promise<User> {
  return await db.user.create({
    data: {
      firstName: 'Bjorn',
      lastName: 'Brassé',
      initials: 'BB',
      email: 'bpbrasse@bra-c.nl',
      organisation: {
        create: {
          name: 'Bra-c',
          slug: 'bra-c',
        },
      },
    },
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
        data: { ...newUser, createdById: adminUser.id },
      });
    }),
  );

  return [adminUser];
}
