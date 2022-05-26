import { db } from '~/utils/db.server';
import {
  Department,
  DepartmentEmployee,
  DepartmentPresence,
  DepartmentPresenceDay,
  User,
} from '@prisma/client';
import { redirect } from 'remix';

export const createDepartment = async ({
  department,
  organisationSlug,
  createdById,
}: {
  department: {
    name: string;
    nameShort: string;
    slug: string;
  };
  organisationSlug: string;
  createdById: string;
}) => {
  return await db.department.create({
    data: {
      ...department,
      createdById,
      organisation: { connect: { slug: organisationSlug } },
    },
  });
};

export const getDepartment = async (
  args:
    | {
        id: string;
        slug?: never;
      }
    | { id?: never; slug: string },
) => {
  const department = await db.department.findUnique({
    where: { id: args?.id, slug: args?.slug },
    include: { organisation: true },
  });

  return department;
};

type ReturnType = Promise<
  DepartmentEmployee & {
    user: User;
    departmentPresences: (DepartmentPresence & {
      departmentPresenceDays: DepartmentPresenceDay[];
    })[];
  }
>;

export async function getDepartmentEmployee({
  departmentId,
  userId,
}: {
  departmentId: string;
  userId: string;
}): ReturnType;
export async function getDepartmentEmployee({
  departmentEmployeeId,
}: {
  departmentEmployeeId?: string;
}): ReturnType;
export async function getDepartmentEmployee(callSignatures: {
  departmentId?: string;
  userId?: string;
  departmentEmployeeId?: string;
}): ReturnType {
  // let departmentEmployee:
  //   | (DepartmentEmployee & {
  //       user: User;
  //       presences: (DepartmentPresence & { days: DepartmentPresenceDays[] })[];
  //     })
  //   | null = null;

  const { departmentId, userId, departmentEmployeeId: id } = callSignatures;

  const departmentEmployee = await db.departmentEmployee.findFirst({
    where: { OR: [{ id }, { AND: [{ departmentId, userId }] }] },
    include: {
      user: true,
      departmentPresences: { include: { departmentPresenceDays: true } },
    },
  });

  if (!departmentEmployee) throw redirect('/organisations');

  return departmentEmployee;
}

export const getDepartments = async ({
  organisationId,
}: {
  organisationId: string;
}) => {
  return await db.department.findMany({
    where: { organisation: { id: organisationId } },
  });
};

// export const createDepartmentUser = async ({
//   departmentId,
//   user,
// }: {
//   departmentId: string;
//   user: User;
// }) => {
//   const department = await db.department.findUnique({
//     where: { id: departmentId },
//   });

//   await db.department.create({
//     data: {
//       employees: {
//         create: {
//           employee: { create: { firstName, lastName, email, passwordHash } },
//         },
//       },
//     },
//   });
// };

export const getDepartmentEmployees = async ({
  departmentId,
}: {
  departmentId: string;
}): Promise<{ id: string; user: User }[]> => {
  return await db.departmentEmployee.findMany({
    where: { departmentId },
    select: { id: true, user: true },
  });
};
