import { Organisation, PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';

export type NewAdminUserData = {
  role: string;
  firstName: string;
  lastName: string;
  initials: string;
  email: string;
  passwordHash: string;
};

export type UserData = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'passwordHash'
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
      email: 'bjorn@admin.nl',
      role: 'ADMIN',
      passwordHash: await bcrypt.hash('admin', 10),
    },
  });
}

export async function seedUsers({
  db,
  organisations,
}: {
  db: PrismaClient;
  organisations: Organisation[];
}): Promise<User[]> {
  const userData: UserData[] = await (async () => [
    {
      email: 'barbara@etz.nl',
      firstName: 'Barbara',
      lastName: 'Maat',
      passwordHash: await bcrypt.hash('etz', 10),
      organisationSlug: organisations[0].slug,
    },
    {
      email: 'mark@etz.nl',
      firstName: 'Mark',
      lastName: 'Jansen',
      passwordHash: await bcrypt.hash('etz', 10),
      organisationSlug: organisations[0].slug,
    },
    {
      email: 'tessa@etz.nl',
      firstName: 'Tessa',
      lastName: 'Leenders',
      passwordHash: await bcrypt.hash('etz', 10),
      organisationSlug: organisations[0].slug,
    },
    {
      email: 'marieke@cze.nl',
      firstName: 'Marieke',
      lastName: 'Kerskes',
      passwordHash: await bcrypt.hash('cze', 10),
      organisationSlug: organisations[1].slug,
    },
  ])();

  return await Promise.all(
    userData.map(({ organisationSlug, ...user }) => {
      return db.user.create({
        data: {
          ...user,
          organisation: { connect: { slug: organisationSlug } },
        },
      });
    }),
  );
}
