import { Booking } from '@prisma/client';
import type { ActionFunction } from 'remix';
import { createBooking } from '~/controllers/booking.server';
import { badRequest } from '~/utils/helpers';
import { z } from 'zod';
import { requireUserId } from '~/controllers/auth.server';

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
  booking?: Booking | null;
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request, '/login');

  const Validator = z.object({
    id: z.string(),
    date: z.string(),
    taskId: z.string(),
  });

  let booking: Booking | null = null;

  try {
    const { id, date, taskId } = Validator.parse(
      Object.fromEntries(await request.formData())
    );

    booking = await createBooking({
      id,
      date: new Date(date),
      taskId,
      userId,
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

  if (!booking)
    return badRequest<ActionData>({
      error: { form: 'Something went wrong.' },
    });

  return { booking };
};

export default () => null;
