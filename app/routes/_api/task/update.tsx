import { Task } from '@prisma/client';
import { ActionFunction, json, redirect } from 'remix';
import { inferSafeParseErrors } from 'types';
import { z } from 'zod';
import { requireUserId } from '~/controllers/auth.server';
import { createTask, updateTask } from '~/controllers/task.server';
import { badRequest } from '~/utils/helpers';
import { db } from '~/utils/db.server';

export const TaskSchema = z.object({
  description: z.string().optional(),
  id: z.string(),
  name: z.string(),
  nameShort: z.string().optional(),
});

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
  });
  if (!result.success)
    return badRequest<ActionData>({
      success: false,
      errors: result.error.flatten(),
    });

  const { id, ...data } = result.data;

  const task: Task | null = await db.task.update({ where: { id }, data });

  if (!task)
    return badRequest<ActionData>({
      success: false,
      fields: result.data,
      errors: { formErrors: [`Task not updated`] },
    });

  return json<ActionData>({ success: true, task });
};

export default () => null;
