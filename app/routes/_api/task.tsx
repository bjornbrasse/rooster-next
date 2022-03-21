import { Task } from '@prisma/client';
import type { ActionFunction } from 'remix';
import { z } from 'zod';
import { requireUserId } from '~/controllers/auth.server';
import { createTask } from '~/controllers/task.server';
import { badRequest } from '~/utils/helpers';

export type ActionData = { task: Task };

export const action: ActionFunction = async ({
  request,
  params,
}): Promise<ActionData | Response> => {
  const userId = await requireUserId(request);

  const Validator = z.object({
    taskId: z.string().optional(),
    departmentId: z.string(),
    name: z.string(),
  });

  let task: Task | null = null;

  try {
    const data = Validator.parse(Object.fromEntries(await request.formData()));

    task = await createTask(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('er treedt een Zod-fout op', error.flatten());

      return badRequest(error.format());
    }
    console.log('er treedt een fout op', error);
  }

  // const fieldErrors: FieldErrors = {
  // firstName: validateText(firstName, {
  //   min: { length: 2, errorMessage: 'MOORE than 2' },
  // }),
  // };
  // if (Object.values(fieldErrors).some(Boolean))
  //   return badRequest<ActionData>({
  //     error: { fields: fieldErrors },
  //     fields,
  //   });

  if (!task)
    return badRequest({
      error: { form: 'Something went wrong.' },
    });

  return { task };
};

export default () => null;
