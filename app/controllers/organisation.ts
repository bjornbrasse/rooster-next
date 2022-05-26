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

const organisationWithEmployees = Prisma.validator<Prisma.OrganisationArgs>()({
  include: { employees: true },
});
export type OrganisationWithEmployees = Prisma.OrganisationGetPayload<
  typeof organisationWithEmployees
>;

export const getOrganisation = async (
  args: { id: string; slug?: never } | { id?: never; slug: string },
) => {
  let organisation: Organisation | null;

  if (args?.id) {
    organisation = await db.organisation.findUnique({
      where: { id: args.id },
    });
  } else {
    organisation = await db.organisation.findUnique({
      where: { slug: args.slug },
    });
  }

  return organisation;
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
