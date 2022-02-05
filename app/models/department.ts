import { db } from '~/utils/db.server';
import { Department } from '@prisma/client';

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
    where: { OR: { id: departmentId, slugName: departmentSlug } },
  });
};
