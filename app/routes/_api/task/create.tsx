import { TaskSchema as BaseTaskSchema } from './update';
import { z } from 'zod';
import { Task } from '@prisma/client';
import { ActionFunction, json, redirect } from 'remix';
import { inferSafeParseErrors } from 'types';
import { requireUserId } from '~/controllers/auth.server';
import { createTask, updateTask } from '~/controllers/task.server';
import { badRequest } from '~/utils/helpers';
import { db } from '~/utils/db.server';

const TaskSchema = BaseTaskSchema.extend({
  createdById: z.string().cuid(),
  departmentId: z.string().cuid(),
  scheduleId: z.optional(z.string().cuid()),
}).omit({ id: true });

export type ActionData =
  | {
      success: false;
      fields?: z.input<typeof TaskSchema>;
      errors?: inferSafeParseErrors<typeof TaskSchema>;
    }
  | { success: true; task: Awaited<ReturnType<typeof createTask>> };

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const result = TaskSchema.safeParse({
    ...Object.fromEntries(await request.formData()),
    createdById: userId,
  });

  if (!result.success)
    return badRequest<ActionData>({
      success: false,
      errors: result.error.flatten(),
    });

  const { data } = result;

  const task: Task | null = await db.task.create({
    data: { ...data },
  });

  if (!task)
    return badRequest<ActionData>({
      success: false,
      fields: result.data,
      errors: { formErrors: [`Task not created`] },
    });

  return json<ActionData>({ success: true, task });
};

export default () => null;
