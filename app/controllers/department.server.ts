import { db } from '~/utils/db.server';
import {
  Department,
  DepartmentEmployee,
  DepartmentPresence,
  DepartmentPresenceDay,
  Prisma,
  User,
} from '@prisma/client';
import { redirect } from 'remix';

export const createDepartment = async (
  data: {
    createdById: string;
    name: string;
    nameShort?: string;
    slug: string;
  } & (
    | {
        organisationId: string;
        organisationSlug?: never;
      }
    | {
        organisationId?: never;
        organisationSlug: string;
      }
  ),
) => {
  const { createdById, organisationSlug, organisationId, ...rest } = data;

  return await db.department.create({
    data: {
      ...rest,
      createdBy: { connect: { id: createdById } },
      organisation: {
        connect: organisationId
          ? { id: organisationId }
          : { slug: organisationSlug },
      },
    },
  });
};

export const getDepartment = async (
  args:
    | {
        departmentId: string;
        organisationId_slug?: never;
        departmentSlug?: never;
        organisationSlug?: never;
      }
    | {
        departmentId?: never;
        organisationId_slug: { organisationId: string; slug: string };
        departmentSlug?: never;
        organisationSlug?: never;
      }
    | {
        departmentSlug: string;
        organisationSlug: string;
        departmentId?: never;
        organisationId_slug?: never;
      },
) => {
  if (args?.departmentSlug && args?.organisationSlug) {
    return await db.department.findUnique({
      where: {
        organisationId_slug: {
          organisationId:
            (
              await db.organisation.findUnique({
                where: { slug: args.organisationSlug },
              })
            )?.id ?? '',
          slug: args.departmentSlug,
        },
      },
    });
  }

  return await db.department.findUnique({
    where: args?.departmentId
      ? { id: args.departmentId }
      : { organisationId_slug: args.organisationId_slug },
    include: {
      employees: {
        include: {
          employee: { select: { id: true, firstName: true, lastName: true } },
        },
      },
      organisation: { include: { employees: true } },
      schedules: { orderBy: { name: 'asc' } },
      tasks: true,
    },
  });
};

type ReturnType = Promise<
  DepartmentEmployee & {
    employee: User;
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

export async function getDepartmentEmployee(args: {
  departmentId?: string;
  employeeId?: string;
  departmentEmployeeId?: string;
}): ReturnType {
  // let departmentEmployee:
  //   | (DepartmentEmployee & {
  //       user: User;
  //       presences: (DepartmentPresence & { days: DepartmentPresenceDays[] })[];
  //     })
  //   | null = null;

  const { departmentId, employeeId, departmentEmployeeId: id } = args;

  const departmentEmployee = await db.departmentEmployee.findFirst({
    where: { OR: [{ id }, { AND: [{ departmentId, employeeId }] }] },
    include: {
      employee: true,
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
    select: { id: true, name: true },
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
    select: { id: true, employee: true },
  });
};
