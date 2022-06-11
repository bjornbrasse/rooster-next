import { db } from '~/utils/db.server';
import { redirect } from 'remix';

export const createSchedule = async (data: {
  createdById: string;
  name: string;
  slug: string;
  departmentId: string;
}) => {
  return await db.schedule.create({
    data,
  });
};

export const getSchedules = async ({
  departmentId,
}: {
  departmentId?: string;
}) => {
  return await db.schedule.findMany({
    where: { departmentId },
    include: { department: { include: { organisation: true } } },
  });
};

export const getSchedule = async (
  args:
    | { scheduleId: string; departmentId_slug?: never }
    | {
        scheduleId?: never;
        departmentId_slug: { departmentId: string; slug: string };
      },
) => {
  return await db.schedule.findUnique({
    where: { id: args?.scheduleId, departmentId_slug: args?.departmentId_slug },
    include: {
      department: {
        include: {
          employees: { include: { employee: true } },
          organisation: true,
          tasks: true,
        },
      },
      scheduleMembers: { include: { member: true } },
      scheduleTasks: { include: { task: true } },
    },
  });
};
