import { ActionFunction, json } from 'remix';
import { ScheduleMember } from '@prisma/client';
import { badRequest } from '~/utils/helpers';
import { z } from 'zod';
import { inferSafeParseErrors } from 'types';
import { requireUserId } from '~/controllers/auth.server';
import { db } from '~/utils/db.server';

const schema = z.object({
  assignedById: z.string().cuid(),
  scheduleId: z.string().cuid(),
  memberId: z.string().cuid(),
});

export type ActionData =
  | {
      success: false;
      errors?: inferSafeParseErrors<typeof schema>;
      fields?: z.input<typeof schema>;
    }
  | {
      success: true;
      scheduleMember: ScheduleMember;
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

  const scheduleMember = await db.scheduleMember.create({ data: result.data });
  if (!scheduleMember)
    return badRequest<ActionData>({
      success: false,
      errors: { formErrors: ['Schedule-Member not created'] },
      fields: result.data,
    });

  return json<ActionData>({ success: true, scheduleMember });
};

export default () => null;
