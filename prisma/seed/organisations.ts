import { Organisation, PrismaClient, User } from '@prisma/client';
import { organisationsData } from './data';

export type NewOrganisationData = Pick<Organisation, 'name' | 'slug'> &
  Partial<Organisation> & {};

export async function seedOrganisations({
  db,
  adminUser,
}: {
  db: PrismaClient;
  adminUser: User;
}) {
  const data: NewOrganisationData[] = await organisationsData();

  await db.organisation.createMany({
    data,
  });
}
