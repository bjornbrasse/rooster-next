import { db } from '~/utils/db.server';
import { Department, User } from '@prisma/client';

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
}) => {
  return await db.department.findFirst({
    where: { OR: { id: departmentId, slugName: departmentSlug } }, include: {organisation: true}
  });
};

export const getDepartments = async ({
  organisationId,
}: {
  organisationId: string;
}) => {
  return await db.department.findMany({
    where: { organisation: {id: organisationId} },
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
