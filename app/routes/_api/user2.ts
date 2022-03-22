import { User } from '@prisma/client';
import type { ActionFunction } from 'remix';
import { json } from 'remix';
import { ActionDataBase, handleFormSubmission } from '~/utils/form.server';
import { validateEmail, validateString } from '~/utils/validators';

type Fields = {
  firstName?: string | null;
  initials?: string | null;
  lastName?: string | null;
  email?: string | null;
};

export interface ActionData extends ActionDataBase {
  user?: User;
  fields: Fields;
  errors: {
    generalError?: string | null;
  } & Fields;
}

export const action: ActionFunction = async ({ request }) => {
  return handleFormSubmission<ActionData>({
    request,
    validators: {
      firstName: validateString,
      initials: validateString,
      lastName: validateString,
      email: validateEmail,
    },
    handleFormValues: async (fields) => {
      console.log('dit gebeurt er', fields);

      const actionData: ActionData = {
        errors: {},
        fields,
        status: 'success',
      };

      return json(actionData);
    },
  });
};
