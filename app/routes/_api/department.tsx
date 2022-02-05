import type { ActionFunction } from 'remix';
import { Department } from '@prisma/client';
import { badRequest } from '~/utils/helpers';
import { validateText } from '~/utils/validation';
import { createDepartment } from '~/models/department';

type Fields = {
  name?: string;
  nameShort?: string;
  slugName?: string;
};

type FieldErrors = {
  name?: string[] | undefined;
  nameShort?: string[] | undefined;
  slugName?: string[] | undefined;
};

export type ActionData = {
  error?: {
    form?: string;
    fields?: FieldErrors;
  };
  fields?: Fields;
  department?: Department | null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const name = form.get('name');
  const nameShort = form.get('nameShort');
  const slugName = form.get('slugName');
  const organisationSlug = form.get('organisationSlug');

  if (
    typeof name !== 'string' ||
    typeof nameShort !== 'string' ||
    typeof slugName !== 'string' ||
    typeof organisationSlug !== 'string'
  ) {
    return badRequest<ActionData>({
      error: { form: `Form not submitted correctly.` },
    });
  }
  const fields = { name, nameShort, slugName };

  const fieldErrors: FieldErrors = {
    name: validateText(name, {
      min: { length: 2, errorMessage: 'MOORE than 2' },
    }),
    nameShort: validateText(nameShort, {
      max: { length: 4, errorMessage: 'MAX 4' },
    }),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest<ActionData>({
      error: { fields: fieldErrors },
      fields,
    });

  const user = await createDepartment({
    department: { name, nameShort, slugName },
    organisationSlug,
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
    return badRequest<ActionData>({
      error: { form: 'Something went wrong.' },
      fields,
    });

  return { user };
};

export default () => null;
