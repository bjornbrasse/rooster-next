import { db } from '~/utils/db.server';
import { Prisma, Task } from '@prisma/client';

export const createTask = async (data: {
  name: string;
  departmentId: string;
  createdById: string;
}): Promise<Task> => {
  return await db.task.create({
    data,
  });
};

export const getTask = async ({ taskId }: { taskId: string }) => {
  return await db.task.findFirst({ where: { id: taskId } });
};

export const getTasks = async (args: { departmentId: string }) => {
  return await db.task.findMany({ where: { departmentId: args.departmentId } });
};

export const updateTask = async ({
  data,
  taskId: id,
}: {
  data: Prisma.TaskUpdateInput;
  taskId: string;
}) => {
  return await db.task.update({ where: { id }, data });
};
