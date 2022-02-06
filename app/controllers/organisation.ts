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
