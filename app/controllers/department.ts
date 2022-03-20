import { db } from '~/utils/db.server';
import {
  Department,
  DepartmentEmployee,
  DepartmentPresence,
  DepartmentPresenceDays,
  Organisation,
  User,
} from '@prisma/client';
import { json, redirect } from 'remix';

export const createDepartment = async ({
  department,
  organisationSlug,
}: {
  department: {
    name: string;
    nameShort: string;
    slugName: string;
  };
  organisationSlug: string;
}): Promise<Department> => {
  return await db.department.create({
    data: {
      ...department,
      organisation: { connect: { slugName: organisationSlug } },
    },
  });
};

export const getDepartment = async ({
  departmentId,
  departmentSlug,
}: {
  departmentId?: string;
  departmentSlug?: string;
}): Promise<Department & { organisation: Organisation }> => {
  const department = await db.department.findFirst({
    where: { OR: { id: departmentId, slugName: departmentSlug } },
    include: { organisation: true },
  });

  // if(!department) throw new Error('Error')
  if (!department) throw redirect('/organisations');

  return department;
};

type ReturnType = Promise<
  DepartmentEmployee & {
    user: User;
    presences: (DepartmentPresence & { days: DepartmentPresenceDays[] })[];
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
  let departmentEmployee:
    | (DepartmentEmployee & {
        user: User;
        presences: (DepartmentPresence & { days: DepartmentPresenceDays[] })[];
      })
    | null = null;

  const { departmentId, userId, departmentEmployeeId: id } = callSignatures;

  departmentEmployee = await db.departmentEmployee.findFirst({
    where: { OR: [{ id }, { AND: [{ departmentId, userId }] }] },
    include: { user: true, presences: { include: { days: true } } },
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
