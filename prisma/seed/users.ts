import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { customRandom, nanoid, random, urlAlphabet } from 'nanoid';

export async function seedUsers({ db }: { db: PrismaClient }): Promise<User[]> {
  const userId = nanoid();

  const adminUser = await db.user.create({
    data: {
      id: userId,
      role: 'ADMIN',
      firstName: 'Bjorn',
      lastName: 'Brassé',
      initials: 'BB',
      email: 'b.brasse@etz.nl',
      passwordHash: await bcrypt.hash('test', 10),
      organisation: { connect: { slug: 'etz' } },
      defaultDepartment: {
        connect: {
          organisationSlug_slug: {
            organisationSlug: 'etz',
            slug: 'ziekenhuisapotheek',
          },
        },
      },
    },
  });

  const us = await getUsers();

  const users = await db.user.createMany({
    data: us.map(({ organisationSlug, defaultDepartmentSlug, ...u }) => ({
      ...u,
      createdById: adminUser.id,
      organisationSlug,
      defaultDepartmentSlug,
    })),
  });

  // return users;
  return [adminUser];
}

export async function getUsers(): Promise<
  (Pick<
    User,
    'firstName' | 'lastName' | 'initials' | 'email' | 'passwordHash'
  > & {
    organisationSlug: string;
    defaultDepartmentSlug: string;
    // defaultTeamSlug: string;
  } & Partial<User>)[]
> {
  return [
    {
      firstName: 'Barbara',
      lastName: 'Maat',
      initials: 'BM',
      email: 'b.maat@etz.nl',
      passwordHash: await bcrypt.hash('test', 10),
      organisationSlug: 'etz',
      defaultDepartmentSlug: 'ziekenhuisapotheek',
      // defaultTeamSlug: '/etz/ziekenhuisapotheek/vakgroep',
      // emailValidationToken: customRandom(urlAlphabet, 48, random)(),
    },
    {
      firstName: 'Mark',
      lastName: 'Jansen',
      initials: 'MJ',
      email: 'm.jansen@etz.nl',
      passwordHash: await bcrypt.hash('test', 10),
      organisationSlug: 'etz',
      defaultDepartmentSlug: 'ziekenhuisapotheek',
      // defaultTeamSlug: '/etz/ziekenhuisapotheek/vakgroep',
      // passwordResetToken: customRandom(urlAlphabet, 48, random)(),
    },
    {
      firstName: 'Rien',
      lastName: 'van Noort',
      initials: 'RvN',
      email: 'rvnoort@elkerliek.nl',
      passwordHash: await bcrypt.hash('test', 10),
      organisationSlug: 'elkerliek',
      defaultDepartmentSlug: 'ziekenhuisapotheek',
      // defaultTeamSlug: '/elkerliek/ziekenhuisapotheek/vakgroep',
    },
    {
      firstName: 'Theo',
      lastName: 'van der Steen',
      initials: 'TvdS',
      email: 'tvdsteen@elkerliek.nl',
      passwordHash: await bcrypt.hash('appels', 10),
      organisationSlug: 'elkerliek',
      defaultDepartmentSlug: 'ziekenhuisapotheek',
      // defaultTeamSlug: '/elkerliek/ziekenhuisapotheek/vakgroep',
    },
  ];
}
