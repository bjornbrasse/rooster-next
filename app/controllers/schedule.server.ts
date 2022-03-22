import { db } from '~/utils/db.server';
import { Schedule } from '@prisma/client';
import { redirect } from 'remix';

export const createSchedule = async ({
  schedule,
  departmentId,
}: {
  schedule: {
    name: string;
    slug: string;
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
    include: { department: { include: { organisation: true } } },
  });
};

export const getSchedule = async ({ scheduleId }: { scheduleId?: string }) => {
  const schedule = await db.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      department: {
        include: { employees: { include: { user: true } }, tasks: true },
      },
      scheduleMembers: { include: { user: true } },
      scheduleTasks: { include: { task: true } },
    },
  });

  if (!schedule) throw redirect('/');

  return schedule;
};
