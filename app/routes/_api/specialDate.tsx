import { SpecialDate } from '@prisma/client';
import type { ActionFunction } from 'remix';
import { z } from 'zod';
import { requireUserId } from '~/controllers/auth.server';
import { db } from '~/utils/db.server';
import { badRequest } from '~/utils/helpers';

export type ActionData = { specialDate: SpecialDate };

export const action: ActionFunction = async ({
  request,
}): Promise<ActionData | Response> => {
  const userId = await requireUserId(request);

  const Validator = z.object({
    date: z.date(),
    name: z.string(),
  });

  let specialDate: SpecialDate | null = null;

  try {
    const data = Validator.parse(Object.fromEntries(await request.formData()));

    specialDate = await db.specialDate.create({
      data: { ...data, createdBy: userId },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('er treedt een Zod-fout op', error.flatten());

      return badRequest(error.format());
    }
    console.log('er treedt een fout op', error);
  }

  if (!specialDate)
    return badRequest({
      error: { form: 'Something went wrong.' },
    });

  return { specialDate };
};

export default () => null;
