import { db } from '~/utils/db.server';
import bcrypt from 'bcrypt';
import { Department, Organisation, User } from '@prisma/client';
import { nanoid } from 'nanoid';

export const createUser = async ({
  userData,
}: {
  userData: {
    departmentId?: string;
    email: string;
    firstName: string;
    initials: string;
    lastName: string;
    organisationId: string;
    // password: string;
  };
}): Promise<User> => {
  const { departmentId, organisationId, ...userDataRest } = userData;

  return await db.user.create({
    // data: {
    //   ...userDataWithoutPassword,
    //   passwordHash: await bcrypt.hash(userData.password, 10),
    // },
    data: {
      ...userDataRest,
      organisationId,
      departments: { create: { departmentId: departmentId ?? '' } },
    },
  });
};

export async function register({
  firstName,
  lastName,
  initials,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  initials: string;
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
      initials,
      email,
      organisation: { connect: { slug: organisationSlug } },
      passwordHash,
      emailValidationToken,
    },
  });
}

export const getOrganisationEmployees = async ({
  organisationId,
}: {
  organisationId: string;
}): Promise<
  (Pick<User, 'id' | 'firstName' | 'lastName'> & {
    organisation: Organisation;
  })[]
> => {
  return await db.user.findMany({
    where: {
      organisationId,
    },
    select: { organisation: true, id: true, firstName: true, lastName: true },
  });
};

export const getUsers = async ({
  organisationId,
}: {
  organisationId: string;
}) => {
  return await db.user.findMany({ where: { organisationId } });
};
