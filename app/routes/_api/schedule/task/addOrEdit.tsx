import { ActionFunction, json } from 'remix';
import { ScheduleTask } from '@prisma/client';
import { badRequest } from '~/utils/helpers';
import { createSchedule } from '~/controllers/schedule.server';
import { z } from 'zod';
import { inferSafeParseErrors } from 'types';
import { requireUserId } from '~/controllers/auth.server';
import { db } from '~/utils/db.server';

const baseSchema = z.object({
  assignedById: z.string().cuid(),
  endDate: z.date(),
  scheduleId: z.string().cuid(),
  startDate: z.date(),
  taskId: z.string().cuid(),
});

const schema = z.preprocess((arg) => {
  const obj = Object(arg);

  obj.endDate = new Date(obj.endDate);
  obj.startDate = new Date(obj.startDate);

  return obj;
}, baseSchema);

export type ActionData =
  | {
      success: false;
      errors?: inferSafeParseErrors<typeof schema>;
      fields?: z.input<typeof schema>;
    }
  | {
      success: true;
      scheduleTask: ScheduleTask;
    };

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const result = schema.safeParse({
    ...Object.fromEntries(await request.formData()),
    assignedById: userId,
  });
  if (!result.success)
    return badRequest<ActionData>({
      success: false,
      errors: result.error.flatten(),
    });

  const scheduleTask = await db.scheduleTask.create({ data: result.data });
  if (!scheduleTask)
    return badRequest<ActionData>({
      success: false,
      errors: { formErrors: ['Schedule-Task not created'] },
      fields: result.data,
    });

  return json<ActionData>({ success: true, scheduleTask });
};

export default () => null;
