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

export async function register({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const passwordHash = await bcrypt.hash(password, 10);
  const emailValidationToken = nanoid(24);

  // TODO: replace with real entry organisation
  const organisationSlug = email.split('@').pop()?.split('.')[0];

  return db.user.create({
    data: {
      firstName,
      lastName,
      email,
      organisation: { connect: { slugName: organisationSlug } },
      passwordHash,
      emailValidationToken,
    },
  });
}

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
