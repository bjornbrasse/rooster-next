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

export const getOrganisation = async ({
  where,
  include,
}: {
  where: Prisma.OrganisationWhereUniqueInput;
  include?: Prisma.OrganisationInclude;
}) => {
  return await db.organisation.findUnique({ where, include });
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
