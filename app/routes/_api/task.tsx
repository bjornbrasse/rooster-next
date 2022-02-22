import { Task } from '@prisma/client';
import type { ActionFunction } from 'remix';
import { createTask } from '~/controllers/task.server';
import { badRequest } from '~/utils/helpers';
import { validateText } from '~/utils/validation';

type Fields = {
  name?: string;
  scheduleId: string;
};

type FieldErrors = {
  name?: string[] | undefined;
  scheduleId?: string[] | undefined;
};

export type ActionData = {
  error?: {
    form?: string;
    fields?: FieldErrors;
  };
  fields?: Fields;
  task?: Task | null;
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  const name = form.get('name');
  const scheduleId = form.get('scheduleId');

  if (typeof name !== 'string' || typeof scheduleId !== 'string') {
    return badRequest<ActionData>({
      error: { form: `Form not submitted correctly.` },
    });
  }
  const fields = { name, scheduleId };

  const fieldErrors: FieldErrors = {
    // firstName: validateText(firstName, {
    //   min: { length: 2, errorMessage: 'MOORE than 2' },
    // }),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest<ActionData>({
      error: { fields: fieldErrors },
      fields,
    });

  const task = await createTask({ ...fields });

  if (!task)
    return badRequest<ActionData>({
      error: { form: 'Something went wrong.' },
      fields,
    });

  return { task };
};

export default () => null;
