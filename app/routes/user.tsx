import { User } from '@prisma/client';
import type { ActionFunction } from 'remix';
import { createUser } from '~/models/user';
import { badRequest } from '~/utils/helpers';
import { validateText } from '~/utils/validation';

// type ActionData = {
//   formError?: string;
//   fields?: {
//     id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//   };
//   fieldErrors?: {
//     firstName: string | undefined;
//     lastName: string | undefined;
//     email: string | undefined;
//   };
// };
type Fields = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

type FieldErrors = {
  firstName?: string[] | undefined;
  lastName?: string[] | undefined;
  email?: string[] | undefined;
};

export type UserActionData = {
  error?: {
    form?: string;
    fields?: FieldErrors;
  };
  fields?: Fields;
  user?: User | null;
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  const firstName = form.get('firstName');
  const lastName = form.get('lastName');
  const email = form.get('email');
  const organisationId = form.get('organisationId');

  if (
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof email !== 'string' ||
    typeof organisationId !== 'string'
  ) {
    return badRequest<UserActionData>({
      error: { form: `Form not submitted correctly.` },
    });
  }
  const fields = { firstName, lastName, email };

  const fieldErrors: FieldErrors = {
    firstName: validateText(firstName, {
      min: { length: 2, errorMessage: 'MOORE than 2' },
    }),
    lastName: validateText(lastName, {
      max: { length: 4, errorMessage: 'MAX 4' },
    }),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest<UserActionData>({
      error: { fields: fieldErrors },
      fields,
    });

  const user = await createUser({
    userData: { ...fields, organisationId },
  });
  // const user = await db.user.create({
  //   data: {
  //     firstName,
  //     lastName,
  //     email,
  //     passwordHash: '123',
  //     organisationId,
  //   },
  // });

  if (!user)
    return badRequest<UserActionData>({
      error: { form: 'Something went wrong.' },
      fields,
    });

  return { user };
};

export default () => null;
