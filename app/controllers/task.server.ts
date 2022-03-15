import { db } from '~/utils/db.server';
import { Task } from '@prisma/client';

export const createTask = async ({
  name,
  departmentId,
}: {
  name: string;
  departmentId: string;
}): Promise<Task> => {
  return await db.task.create({
    data: { name, departmentId },
  });
};


export const getTask = async (taskId: string) => {
  return await db.task.findFirst({where: {id: taskId}})
}

export const getTasks = async ({departmentId}: {departmentId: string}) => {
  return await db.task.findMany({where: {departmentId}})
}