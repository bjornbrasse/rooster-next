import type { ActionFunction } from 'remix';
import { redirect, useActionData, useSearchParams } from 'remix';
import { db } from '~/utils/db.server';
import { badRequest } from '~/utils/helpers';
import { register } from '~/controllers/auth.server';

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
  const lastName = form.get('lastName');
  const email = form.get('email');
  const password = form.get('password');
  const passwordConfirm = form.get('passwordConfirm');
  const redirectTo = form.get('redirectTo') || '/login';
  if (
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof passwordConfirm !== 'string' ||
    typeof redirectTo !== 'string'
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  console.log('tot hier 1?');

  const fields = { firstName, lastName, email, password, passwordConfirm };
  const fieldErrors = {
    firstName: validateEmail(firstName),
    lastName: validateEmail(lastName),
    email: validateEmail(email),
    password: validatePassword(password),
    passwordConfirm: validatePassword(passwordConfirm),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  const userExists = await db.user.findFirst({
    where: { email },
  });
  if (userExists) {
    return badRequest({
      fields,
      formError: `User with email ${email} already exists`,
    });
  }

  console.log('tot hier 2?');

  const user = await register({ firstName, lastName, email, password });

  if (!user) {
    return badRequest({
      fields,
      formError: `Something went wrong trying to create a new user.`,
    });
  }

  return redirect('emailSent');
};

export default function RegisterRoute() {
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
          <input
            type="text"
            id="lastName-input"
            name="lastName"
            className="block"
            defaultValue={actionData?.fields?.lastName}
            aria-invalid={Boolean(actionData?.fieldErrors?.lastName)}
            aria-describedby={
              actionData?.fieldErrors?.lastName ? 'lastName-error' : undefined
            }
          />
          <label htmlFor="email-input">Email</label>
          <input
            type="text"
            id="email-input"
            name="email"
            className="block"
            defaultValue={actionData?.fields?.email}
            aria-invalid={Boolean(actionData?.fieldErrors?.email)}
            aria-describedby={
              actionData?.fieldErrors?.email ? 'email-error' : undefined
            }
          />
          {actionData?.fieldErrors?.email ? (
            <p className="form-validation-error" role="alert" id="email-error">
              {actionData?.fieldErrors.email}
            </p>
          ) : null}
          <div className="grid grid-cols-2 items-center">
            <label htmlFor="password-input">Wachtwoord</label>
            <input
              id="password-input"
              name="password"
              defaultValue={actionData?.fields?.password}
              type="password"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.password) || undefined
              }
              aria-describedby={
                actionData?.fieldErrors?.password ? 'password-error' : undefined
              }
            />
            <label htmlFor="passwordConfirm-input">Bevestig wachtwoord</label>
            <input
              id="passwordConfirm-input"
              name="passwordConfirm"
              defaultValue={actionData?.fields?.passwordConfirm}
              type="password"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.passwordConfirm) || undefined
              }
              aria-describedby={
                actionData?.fieldErrors?.passwordConfirm
                  ? 'passwordConfirm-error'
                  : undefined
              }
            />
          </div>
          {actionData?.fieldErrors?.password ? (
            <p
              className="form-validation-error"
              role="alert"
              id="password-error"
            >
              {actionData?.fieldErrors.password}
            </p>
          ) : null}
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData?.formError}
              </p>
            ) : null}
          </div>
          <button type="submit" className="btn">
            Registreer
          </button>
        </form>
      </div>
    </div>
  );
}
