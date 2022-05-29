import { __ } from '@headlessui/react/dist/types';
import { Organisation, Prisma, User } from '@prisma/client';
import { db } from '~/utils/db.server';

export const createOrganisation = async ({
  data,
}: {
  data: Prisma.OrganisationCreateInput;
}): Promise<Organisation | null> => {
  const organisation = await db.organisation.create({
    data,
  });

  return organisation;
};

export const getOrganisation = async (
  args: { id: string; slug?: never } | { id?: never; slug: string },
) => {
  return await db.organisation.findUnique({
    where: { id: args?.id, slug: args?.slug },
    include: { departments: true, employees: true },
  });
};

export const findOrganisation = async ({
  id,
  slug,
}: {
  id?: string;
  slug?: string;
}): Promise<Organisation | null> => {
  if (id) return await db.organisation.findUnique({ where: { id } });

  if (slug) return await db.organisation.findUnique({ where: { slug } });

  return null;
};
