import { Task } from '@prisma/client';
import { ActionFunction, json, redirect } from 'remix';
import { inferSafeParseErrors } from 'types';
import { z } from 'zod';
import { requireUserId } from '~/controllers/auth.server';
import { createTask, updateTask } from '~/controllers/task.server';
import { badRequest } from '~/utils/helpers';
import { db } from '~/utils/db.server';

const schema = z.object({
  _action: z.enum(['create', 'update']),
  departmentId: z.string().cuid().optional(),
  description: z.string().optional(),
  name: z.string(),
  nameShort: z.string().optional(),
  scheduleId: z.string().cuid().or(z.undefined()),
  taskId: z.string().optional(),
});


export type ActionData =
  | {
      success: false;
      fields?: z.input<typeof schema>;
      errors?: inferSafeParseErrors<typeof schema>;
    }
  | { success: true; task: Awaited<ReturnType<typeof createTask>> };

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const result = schema.safeParse({
    ...Object.fromEntries(await request.formData()),
  });
  if (!result.success)
    return badRequest<ActionData>({
      success: false,
      errors: result.error.flatten(),
    });

  const { _action, taskId, scheduleId, ...data } = result.data;

  let task: Task | null = null;

  switch (_action) {
    case 'create':
      console.log('DIT IS HET', result.data);

      task = await db.task.create({
        data: {
          departmentId: data.departmentId!,
          ...data,
          createdById: userId,
        },
      });
      break;
    case 'update':
      console.log('KOMT HIER???');
      task = await updateTask({ taskId: taskId!, data });
      break;
  }
  if (!task)
    return badRequest<ActionData>({
      success: false,
      fields: result.data,
      errors: { formErrors: [`Task not ${_action}d`] },
    });

  return json<ActionData>({ success: true, task });
};

export default () => null;
