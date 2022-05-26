import { db } from '~/utils/db.server';
import bcrypt from 'bcrypt';
import { Department, Organisation, Prisma, User } from '@prisma/client';
import { nanoid } from 'nanoid';

export const createUser = async ({
  data,
}: {
  data: Prisma.UserCreateInput;
}): Promise<User> => {
  return await db.user.create({
    // data: {
    //   ...userDataWithoutPassword,
    //   passwordHash: await bcrypt.hash(userData.password, 10),
    // },
    data,
  });
};

export const getOrganisationEmployees = async ({
  organisationId,
}: {
  organisationId: string;
}) => {
  return await db.user.findMany({
    where: {
      organisationId,
    },
    select: { organisation: true, id: true, firstName: true, lastName: true },
  });
};

export const getUser = async (
  args:
    | { id: string; passwordResetToken?: never }
    | { id?: never; passwordResetToken: string },
) => {
  if (args.passwordResetToken)
    return await db.user.findFirst({
      where: { passwordResetToken: args.passwordResetToken },
    });

  return await db.user.findFirst({ where: { id: args.id } });
};

export const getUsers = async (
  args:
    | {
        organisationId: string;
        organisationSlug?: never;
      }
    | { organisationId?: never; organisationSlug: string },
) => {
  if (args.organisationId)
    return await db.user.findMany({
      where: { organisationId: args.organisationId },
    });

  return await db.user.findMany({
    where: { organisation: { slug: args.organisationSlug } },
  });
};
