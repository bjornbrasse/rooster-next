import { Organisation, PrismaClient } from '@prisma/client';
import { organisationsData } from './data';

export type NewOrganisationData = Pick<Organisation, 'name' | 'slug'> &
  Partial<Organisation> & {};

export async function seedOrganisations({ db }: { db: PrismaClient }) {
  await db.user.create({
    data: {
      firstName: 'Bjorn',
      lastName: 'Brassé',
      email: 'test',
      initials: 'BB',
      organisation: { create: { name: 'test', slug: 'test' } },
    },
  });

  const data: NewOrganisationData[] = await organisationsData();

  await db.organisation.createMany({
    data,
  });
}
