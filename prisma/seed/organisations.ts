import {
  Department,
  Organisation,
  PrismaClient,
  Schedule,
  User,
} from '@prisma/client';
import organisation from '~/routes/_api/organisation';

type OrganisationData = Pick<Organisation, 'name' | 'slug' | 'emailDomain'> & {
  departments: (Pick<Department, 'name' | 'slug'> & {
    schedules?: Pick<Schedule, 'name' | 'slug'>[];
  })[];
} & Partial<Organisation>;

const organisationData: OrganisationData[] = [
  {
    name: 'Elisabeth-TweeSteden Ziekenhuis',
    nameShort: 'ETZ',
    slug: 'etz',
    emailDomain: '@etz.nl',
    departments: [
      {
        name: 'Ziekenhuisapotheek',
        slug: 'ziekenhuisapotheek',
        schedules: [{ name: 'Vakgroep', slug: 'vakgroep' }],
      },
    ],
  },
  {
    name: 'Catharina Ziekenhuis Eindhoven',
    nameShort: 'CZE',
    slug: 'cze',
    emailDomain: '@cze.nl',
    departments: [{ name: 'Cardiologie', slug: 'cardiologie' }],
  },
];

export async function seedOrganisations({
  db,
  adminUser,
}: {
  db: PrismaClient;
  adminUser: User;
}) {
  return await Promise.all(
    organisationData.map(({ departments, ...organisation }) => {
      return db.organisation.create({
        data: {
          ...organisation,
          createdById: adminUser.id,
          departments: {
            create: departments.map(({ schedules, ...department }) => ({
              ...department,
              createdById: adminUser.id,
              schedules: {
                create: schedules?.map((schedule) => ({
                  ...schedule,
                  createdById: adminUser.id,
                })),
              },
            })),
          },
        },
      });
    }),
  );
}
