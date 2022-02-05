import { db } from '~/utils/db.server';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';

export const createUser = async ({
  userData,
}: {
  userData: {
    email: string;
    firstName: string;
    lastName: string;
    organisationId: string;
    // password: string;
  };
}): Promise<User> => {
  // const { password, ...userDataWithoutPassword } = userData;

  return await db.user.create({
    // data: {
    //   ...userDataWithoutPassword,
    //   passwordHash: await bcrypt.hash(userData.password, 10),
    // },
    data: { ...userData },
  });
};

export const getOrganisationEmployees = async ({
  organisationId,
  organisationSlug,
}: {
  organisationId?: string;
  organisationSlug?: string;
}): Promise<User[]> => {
  return await db.user.findMany({
    where: {
      OR: { organisationId, organisation: { slugName: organisationSlug } },
    },
  });
};
