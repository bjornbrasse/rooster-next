import { Organisation } from '@prisma/client';
import { db } from '~/utils/db.server';

export const findOrganisation = async ({
  id,
  slugName,
}: {
  id?: string;
  slugName?: string;
}): Promise<Organisation | null> => {
  if (id) return await db.organisation.findUnique({ where: { id } });

  if (slugName)
    return await db.organisation.findUnique({ where: { slugName } });

  return null;
};
