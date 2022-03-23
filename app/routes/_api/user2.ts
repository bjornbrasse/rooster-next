import { User } from '@prisma/client';
import type { ActionFunction } from 'remix';
import { json } from 'remix';
import { requireUserId } from '~/controllers/auth.server';
import { createUser } from '~/controllers/user.server';
import { ActionDataBase, handleFormSubmission } from '~/utils/form.server';
import { validateEmail, validateString } from '~/utils/validators';

type Fields = {
  firstName?: string | null;
  initials?: string | null;
  lastName?: string | null;
  email?: string | null;
  organisationId?: string | null;
  departmentId?: string | null;
};

export interface ActionData extends ActionDataBase {
  user?: User;
  fields: Fields;
  errors: {
    generalError?: string | null;
  } & Fields;
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  return handleFormSubmission<ActionData>({
    request,
    validators: {
      firstName: validateString({}),
      lastName: validateString({}),
      email: validateEmail,
      initials: validateString({
        min: { length: 2, errorMessage: 'Moet echt groter zijn dan 1!' },
        max: { length: 5, errorMessage: 'Walgelijk lang dit!' },
      }),
      organisationId: validateString(),
      departmentId: validateString(),
    },
    handleFormValues: async (fields) => {
      console.log('dit gebeurt er', fields);

      const user = await createUser(userId, { ...fields });

      return json<ActionData>({ user, fields, status: 'success', errors: {} });
    },
  });
};
