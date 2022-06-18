import { SpecialDate } from '@prisma/client';
import dayjs from 'dayjs';
import { ActionFunction, json } from 'remix';
import { inferSafeParseErrors } from 'types';
import { z } from 'zod';
import { requireUserId } from '~/controllers/auth.server';
import { db } from '~/utils/db.server';
import { badRequest } from '~/utils/helpers';

const baseSchema = z.object({
  description: z.string().optional(),
  id: z.string().optional(),
  name: z.string(),
  date: z.date(),
});

const schema = z.preprocess((arg) => {
  const obj = Object(arg);
  console.log('Dit is de datum eerst', obj.date);
  obj.date = dayjs(obj.date, 'DD-MM-YYYY').toDate();
  console.log('En dit is de datum erna', obj.date);

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
      specialDate: SpecialDate;
    };

export const action: ActionFunction = async ({
  request,
}): Promise<ActionData | Response> => {
  const userId = await requireUserId(request);

  const result = schema.safeParse(Object.fromEntries(await request.formData()));

  if (!result.success)
    return badRequest<ActionData>({
      success: false,
      errors: result.error.flatten(),
    });

  let specialDate: SpecialDate | null = null;

  const { id, ...data } = result.data;

  if (result.data.id) {
    specialDate = await db.specialDate.update({ where: { id }, data });
  } else {
    specialDate = await db.specialDate.create({
      data: { ...data, createdBy: userId },
    });
  }

  if (!specialDate)
    return badRequest<ActionData>({
      success: false,
      errors: {
        formErrors: [
          `Special date not ${result.data.id ? 'update' : 'create'}d`,
        ],
      },
      fields: result.data,
    });

  return json<ActionData>({ success: true, specialDate });
};

export default () => null;
