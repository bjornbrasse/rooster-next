import { User } from '@prisma/client';
import { json } from 'remix';
import { db } from './utils/db.server';
import { badRequest } from './utils/helpers';
import { validateText } from './utils/validation';

export type ActionData = {
  formError?: string;
  fieldErrors?: {
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    password: string | undefined;
  };
  fields?: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export const createUser = async ({
  request,
}: {
  request: Request;
}): Promise<Response> => {
  const form = await request.formData();

  const userId = form.get('userId');

  const firstName = form.get('firstName');
  const lastName = form.get('lastName');
  const email = form.get('email');
  const password = form.get('password');
  const passwordConfirm = form.get('passwordConfirm');

  if (
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof passwordConfirm !== 'string'
  ) {
    return badRequest({
      FormError: `Form not submitted correctly.`,
    });
  }
  const fields = { firstName, lastName, email, password, passwordConfirm };

  const fieldErrors = {
    firstName: validateText(firstName, {
      min: { length: 2, errorMessage: 'MOORE than 2' },
    }),
    lastName: validateText(lastName, {
      max: { length: 4, errorMessage: 'MAX 4' },
    }),
    password:
      password !== passwordConfirm ? 'WW komen niet overeen!' : undefined,
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  let user: User | null;

  if (userId) {
    user = await db.user.update({
      where: { id: userId as string },
      data: { firstName, lastName, email },
    });
  } else {
    user = await db.user.create({
      data: { firstName, lastName, email, passwordHash: password as string },
    });
  }

  if (!user)
    return badRequest<ActionData>({ formError: 'Something went wrong.' });

  return json({ fields: { ...user } });
};
