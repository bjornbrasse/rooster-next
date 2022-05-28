import { Task } from '@prisma/client';
import { ActionFunction, json } from 'remix';
import { inferSafeParseErrors } from 'types';
import { z } from 'zod';
import { requireUserId } from '~/controllers/auth.server';
import { createTask } from '~/controllers/task.server';
import { badRequest } from '~/utils/helpers';

const schema = z.object({
  taskId: z.string().optional(),
  departmentId: z.string(),
  name: z.string(),
  createdById: z.string().cuid(),
});

export type ActionData = {
  fields?: z.input<typeof schema>;
  errors?: inferSafeParseErrors<typeof schema>;
  task?: Awaited<ReturnType<typeof createTask>>;
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const result = schema.safeParse({
    ...Object.fromEntries(await request.formData()),
    createdById: userId,
  });

  if (!result.success)
    return badRequest<ActionData>({
      errors: result.error.flatten(),
    });

// const { taskId, ...data } = result;
  const task = await createTask(result.data);

  if (!task)
    return badRequest<ActionData>({
      fields: result.data,
      errors: { formErrors: ['Task not created'] },
    });

  return json<ActionData>({ task });
};

export default () => null;
