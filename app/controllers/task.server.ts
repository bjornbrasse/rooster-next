import { db } from '~/utils/db.server';
import { Task } from '@prisma/client';

export const createTask = async ({
  name,
  scheduleId,
}: {
  name: string;
  scheduleId: string;
}): Promise<Task> => {
  return await db.task.create({
    data: { name, scheduleId },
  });
};
