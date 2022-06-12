import type { ActionFunction } from 'remix';
import { redirect, useActionData, useSearchParams } from 'remix';
import { badRequest } from '~/utils/helpers';

function validateEmail(email: unknown) {
  if (typeof email !== 'string' || email.length < 3) {
    return `Emails must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== 'string' || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    password: string | undefined;
    passwordConfirm: string | undefined;
  };
  fields?: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  console.log('tot hier -1?');
  console.log('tot hier 0?', await request.formData());

  const form = await request.formData();
  const firstName = form.get('firstName');

  if (typeof firstName !== 'string') {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  console.log('tot hier 1?');

  const fields = { firstName };
  const fieldErrors = {
    firstName: validateEmail(firstName),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  // const userExists = await db.user.findFirst({
  //   where: { email },
  // });
  // if (userExists) {
  //   return badRequest({
  //     fields,
  //     formError: `User with email ${email} already exists`,
  //   });
  // }

  console.log('tot hier 2?');

  return redirect('emailSent');
};

export default function Register() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();

  return (
    <div className="container">
      <div className="content" data-light="">
        <form
          method="POST"
          aria-describedby={
            actionData?.formError ? 'form-error-message' : undefined
          }
        >
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get('redirectTo') ?? undefined}
          />
          <label htmlFor="firstName-input">Voornaam</label>
          <input
            type="text"
            id="firstName-input"
            className="block"
            name="firstName"
            aria-invalid={Boolean(actionData?.fieldErrors?.firstName)}
            aria-describedby={
              actionData?.fieldErrors?.firstName ? 'firstName-error' : undefined
            }
          />
          <label htmlFor="lastName-input">Achternaam</label>

          <button type="submit" className="btn">
            Registreer
          </button>
        </form>
      </div>
    </div>
  );
}
