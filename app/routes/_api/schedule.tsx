import { ActionFunction, json } from 'remix';
import { Schedule } from '@prisma/client';
import { badRequest } from '~/utils/helpers';
import { validateText } from '~/utils/validation';
import { createSchedule } from '~/controllers/schedule.server';
import { z } from 'zod';
import { inferSafeParseErrors } from 'types';
import { requireUserId } from '~/controllers/auth.server';

const schema = z.object({
  createdById: z.string().cuid(),
  departmentId: z.string().cuid(),
  name: z.string(),
  slug: z.string(),
});

export type ActionData =
  | {
      success: false;
      errors?: inferSafeParseErrors<typeof schema>;
      fields?: z.input<typeof schema>;
    }
  | {
      success: true;
      schedule: Schedule;
    };

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const result = schema.safeParse({
    ...Object.fromEntries(await request.formData()),
    createdById: userId,
  });

  if (!result.success)
    return badRequest<ActionData>({
      success: false,
      errors: result.error.flatten(),
    });

  const schedule = await createSchedule(result.data);

  if (!schedule)
    return badRequest<ActionData>({
      success: false,
      errors: { formErrors: ['Schedule not created'] },
      fields: result.data,
    });

  return json<ActionData>({ success: true, schedule });
};

export default () => null;
