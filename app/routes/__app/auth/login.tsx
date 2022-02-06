// import * as React from 'react';
import { ActionFunction, Link } from 'remix';
import { useActionData, useSearchParams } from 'remix';
import RequestPasswordResetForm from '~/components/forms/RequestPasswordResetForm';
import { useDialog } from '~/contexts/dialog';
import { badRequest } from '~/utils/helpers';
import { createUserSession, login } from '~/controllers/auth.server';
import { validateText } from '~/utils/validation';

function validateEmail(email: unknown) {
  if (typeof email !== 'string' || email.length < 3) {
    return `Emails must be at least 3 characters long`;
  }
}

// function validatePassword(password: unknown) {
//   if (typeof password !== 'string' || password.length < 5) {
//     return `Passwords must be at least 6 characters long`;
//   }
// }

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email: string | undefined;
    password: string | undefined;
  };
  fields?: {
    email: string;
    password: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get('email');
  const password = form.get('password');

  if (typeof email !== 'string' || typeof password !== 'string') {
    return badRequest<ActionData>({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { email, password };
  const fieldErrors = {
    email: validateEmail(email),
    password: validateText(password, {
      min: { length: 4, errorMessage: 'MOORE than 4' },
    }),
  };

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  const user = await login({ email, password });

  if (!user) {
    return badRequest({
      fields,
      formError: `Email/Password combination is incorrect`,
    });
  }

  return createUserSession(user, `/${user.organisation.slugName}`);
};

export default function LoginRoute() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();

  const { openDialog } = useDialog();

  // const passwordResetHandler: EventHandler<React.SyntheticEvent> = (e) => {
  //   e.preventDefault();
  //   console.log('jajaj');
  //   openDialog('test', <RequestPasswordResetForm />, 'hoi');
  // };

  return (
    <div className="container">
      <div
        className="card mb-24 px-8 py-4 flex flex-col justify-center bg-white border border-primary"
        data-light=""
      >
        <h1 className="mb-4 text-primary text-xl text-center">Login</h1>

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
          <div>
            <label htmlFor="email-input">Email</label>
            <p>
              <input
                autoFocus={true}
                type="text"
                id="email-input"
                name="email"
                defaultValue={actionData?.fields?.email}
                aria-invalid={Boolean(actionData?.fieldErrors?.email)}
                aria-describedby={
                  actionData?.fieldErrors?.email ? 'email-error' : undefined
                }
              />
            </p>
            {actionData?.fieldErrors?.email ? (
              <p
                className="form-validation-error"
                role="alert"
                id="email-error"
              >
                {actionData?.fieldErrors.email}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <p>
              <input
                id="password-input"
                name="password"
                defaultValue={actionData?.fields?.password}
                type="password"
                aria-invalid={
                  Boolean(actionData?.fieldErrors?.password) || undefined
                }
                aria-describedby={
                  actionData?.fieldErrors?.password
                    ? 'password-error'
                    : undefined
                }
              />
            </p>
            {actionData?.fieldErrors?.password ? (
              <p
                className="form-validation-error"
                role="alert"
                id="password-error"
              >
                {actionData?.fieldErrors.password}
              </p>
            ) : null}
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData?.formError}
              </p>
            ) : null}
          </div>
          <p>
            Forgot password?{' '}
            <Link to="/auth/requestPasswordReset" className="p-2 bg-gray-200">
              Reset Password
            </Link>
          </p>
          <button type="submit" className="btn mt-4 inline-block">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
