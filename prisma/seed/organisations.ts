import { Organisation, PrismaClient } from '@prisma/client';

export async function seedOrganisations({ db }: { db: PrismaClient }) {
  const organisations = await getOrganisations();

  await db.organisation.createMany({
    data: organisations,
  });
}

export async function getOrganisations(): Promise<
  (Pick<Organisation, 'name' | 'slug'> & Partial<Organisation> & {})[]
> {
  return [
    {
      name: 'Elisabeth-TweeSteden Ziekenhuis',
      nameShort: 'ETZ',
      slug: 'etz',
    },
    {
      name: 'Elkerliek Ziekenhuis',
      nameShort: 'Elkerliek',
      slug: 'elkerliek',
    },
  ];
}
