import { Organisation, PrismaClient, User } from '@prisma/client';

type OrganisationData = Pick<Organisation, 'name' | 'slug'> &
  Partial<Organisation> & {};

const organisationData: OrganisationData[] = [
  {
    name: 'Elisabeth-TweeSteden Ziekenhuis',
    nameShort: 'ETZ',
    slug: 'etz',
  },
  {
    name: 'Catharina Ziekenhuis Eindhoven',
    nameShort: 'CZE',
    slug: 'cze',
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
    organisationData.map((organisation) => {
      return db.organisation.create({
        data: { ...organisation, createdById: adminUser.id },
      });
    }),
  );
}
