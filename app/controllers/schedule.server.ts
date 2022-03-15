import { db } from '~/utils/db.server';
import { Schedule } from '@prisma/client';

export const createSchedule = async ({
  schedule,
  departmentId,
}: {
  schedule: {
    name: string;
  };
  departmentId: string;
}): Promise<Schedule | null> => {
  return await db.schedule.create({
    data: {
      ...schedule,
      department: { connect: { id: departmentId } },
    },
  });
};

export const getSchedules = async ({
  departmentId,
}: {
  departmentId?: string;
}) => {
  return await db.schedule.findMany({
    where: { departmentId },
  });
};

export const getSchedule = async ({ scheduleId }: { scheduleId?: string }) => {
  return await db.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      department: { include: { employees: { include: { user: true } } } },
      members: { include: { user: true } },
      tasks: { orderBy: [{ name: 'asc' }] },
    },
  });
};
