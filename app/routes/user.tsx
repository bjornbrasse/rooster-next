import type { ActionFunction } from 'remix';
import { redirect } from 'remix';
import { db } from '~/utils/db.server';
import { badRequest } from '~/utils/helpers';
import { validateText } from '~/utils/validation';

type ActionData = {
  formError?: string;
  fields?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  fieldErrors?: {
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
  };
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
    return badRequest({
      FormError: `Form not submitted correctly.`,
    });
  }
  const fields = { firstName, lastName, email };

  const fieldErrors = {
    firstName: validateText(firstName, {
      min: { length: 2, errorMessage: 'MOORE than 2' },
    }),
    lastName: validateText(lastName, {
      max: { length: 4, errorMessage: 'MAX 4' },
    }),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  const user = await db.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash: '123',
      organisationId,
    },
  });

  if (!user)
    return badRequest<ActionData>({ formError: 'Something went wrong.' });

  // return redirect(`/${organisation.slugName}/admin/employees`);
  return null;
};

export default () => null;
