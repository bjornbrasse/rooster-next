import { DepartmentPresence } from '@prisma/client';
import type { ActionFunction } from 'remix';
import { z } from 'zod';
import { requireUserId } from '~/controllers/auth.server';
import { db } from '~/utils/db.server';
import { badRequest } from '~/utils/helpers';

export type ActionData = { departmentPresence: DepartmentPresence };

export const action: ActionFunction = async ({
  request,
}): Promise<ActionData | Response> => {
  const userId = await requireUserId(request);

  const data = await request.formData();
  console.log('dit is de datum', data.get('from'));

  const Validator = z.object({
    departmentEmployeeId: z.string(),
    from: z.date(),
  });

  let departmentPresence: DepartmentPresence | null = null;

  try {
    const { departmentEmployeeId, from } = Validator.parse(
      Object.fromEntries(await request.formData()),
    );

    departmentPresence = await db.departmentPresence.create({
      data: {
        departmentEmployeeId,
        from,
        departmentPresenceDays: { create: [{ day: 1, hours: 1.4 }] },
      },
    });
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

  if (!departmentPresence)
    return badRequest({
      error: { form: 'Something went wrong.' },
    });

  return { departmentPresence };
};

export default () => null;
