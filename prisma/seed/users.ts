import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { customRandom, random, urlAlphabet } from 'nanoid';

// const getDepartment = async (
//   db: PrismaClient,
//   organisationSlug: string,
//   departmentSlug: string
// ) =>
//   await db.department.findFirst({
//     where: {
//       AND: [
//         { organisation: { slug: organisationSlug } },
//         { slug: departmentSlug },
//       ],
//     },
//   });

// const getTeam = async (
//   db: PrismaClient,
//   departmentSlug: string,
//   teamSlug: string
// ) =>
//   await db.team.findFirst({
//     where: {
//       AND: [{ department: { slug: departmentSlug } }, { slug: teamSlug }],
//     },
//   });

export async function seedUsers({ db }: { db: PrismaClient }): Promise<User[]> {
 const users = await getUsers()
 
  const adminUser = await db.user.create({data: users.filter(u => u.role === 'ADMIN')[0]})

    const users = await db.user.createMany({data: (await getUsers()).map(u => ({}))})
  }
}

export async function getUsers(): Promise<
  (Pick<
    User,
    'firstName' | 'lastName' | 'initials' | 'email' | 'passwordHash'
  > & {
    organisationSlug: string;
    defaultDepartmentSlug: string;
    defaultTeamSlug: string;
  } & Partial<User>)[]
> {
  return [
    {
      firstName: 'Bjorn',
      lastName: 'Brassé',
      initials: 'BB',
      email: 'b.brasse@etz.nl',
      passwordHash: await bcrypt.hash('test', 10),
      organisationSlug: 'etz',
      defaultDepartmentSlug: '/etz/ziekenhuisapotheek',
      defaultTeamSlug: '/etz/ziekenhuisapotheek/vakgroep',
    },
    {
      firstName: 'Barbara',
      lastName: 'Maat',
      initials: 'BM',
      email: 'b.maat@etz.nl',
      passwordHash: await bcrypt.hash('test', 10),
      organisationSlug: 'etz',
      defaultDepartmentSlug: '/etz/ziekenhuisapotheek',
      defaultTeamSlug: '/etz/ziekenhuisapotheek/vakgroep',
      // emailValidationToken: customRandom(urlAlphabet, 48, random)(),
    },
    {
      firstName: 'Mark',
      lastName: 'Jansen',
      initials: 'MJ',
      email: 'm.jansen@etz.nl',
      passwordHash: await bcrypt.hash('test', 10),
      organisationSlug: 'etz',
      defaultDepartmentSlug: '/etz/ziekenhuisapotheek',
      defaultTeamSlug: '/etz/ziekenhuisapotheek/vakgroep',
      // passwordResetToken: customRandom(urlAlphabet, 48, random)(),
    },
    {
      firstName: 'Rien',
      lastName: 'van Noort',
      initials: 'RvN',
      email: 'rvnoort@elkerliek.nl',
      passwordHash: await bcrypt.hash('test', 10),
      organisationSlug: '/elkerliek',
      defaultDepartmentSlug: '/elkerliek/ziekenhuisapotheek',
      defaultTeamSlug: '/elkerliek/ziekenhuisapotheek/vakgroep',
    },
    {
      firstName: 'Theo',
      lastName: 'van der Steen',
      initials: 'TvdS',
      email: 'tvdsteen@elkerliek.nl',
      passwordHash: await bcrypt.hash('appels', 10),
      organisationSlug: '/elkerliek',
      defaultDepartmentSlug: '/elkerliek/ziekenhuisapotheek',
      defaultTeamSlug: '/elkerliek/ziekenhuisapotheek/vakgroep',
    },
  ];
}
