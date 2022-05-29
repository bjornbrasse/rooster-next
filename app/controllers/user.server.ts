import { db } from '~/utils/db.server';
import bcrypt from 'bcrypt';
import { Department, Organisation, Prisma, User } from '@prisma/client';
import { nanoid } from 'nanoid';
import { userWithFullName } from '~/utils/user';

export const createUser = async ({
  data,
}: {
  data: Prisma.UserCreateInput;
}) => {
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
  let users: { id: string; firstName: string; lastName: string }[] = [];

  if (args.organisationId)
    users = await db.user.findMany({
      where: { organisationId: args.organisationId },
      select: { id: true, firstName: true, lastName: true },
    });

  if (args.organisationSlug)
    users = await db.user.findMany({
      where: { organisation: { slug: args.organisationSlug } },
      select: { id: true, firstName: true, lastName: true },
    });

  return { users: users.map((u) => userWithFullName(u)) };
};
