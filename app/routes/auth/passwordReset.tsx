import { redirect, useActionData, useLoaderData } from 'remix';
import type { ActionFunction, LoaderFunction } from 'remix';
import { db } from '~/utils/db.server';
import { badRequest } from '~/utils/helpers';
import { createUserSession, resetPassword } from '~/controllers/auth.server';

type LoaderDate = {
  email: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const token = new URL(request.url).searchParams.get('token');

  const user = await db.user.findFirst({
    where: { passwordResetToken: String(token) },
  });

  if (!user) return redirect('/auth/login');

  return { email: user.email };
};

export const action: ActionFunction = async ({ request }) => {
  console.log('hier 0');
  const form = await request.formData();
  const email = form.get('email');
  const newPassword = form.get('password');
  const newPasswordConfirm = form.get('passwordConfirm');
  if (
    typeof email !== 'string' ||
    typeof newPassword !== 'string' ||
    typeof newPasswordConfirm !== 'string'
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }
  console.log('hier 1');

  const user = await resetPassword({ email, newPassword });

  console.log('hier 2', user);
  if (!user) return redirect('/login');

  return createUserSession(user, '/');
};

export default function PasswordResetRoute() {
  const data = useLoaderData<LoaderDate>();
  const actionData = useActionData();

  return (
    <div>
      <p>Wachtwoord resetten voor gebruiker {data.email}</p>
      <form method="POST">
        <input type="hidden" name="email" value={data.email} />

        <label htmlFor="password-input">Wachtwoord</label>
        <input
          id="password-input"
          name="password"
          defaultValue={actionData?.fields?.password}
          type="password"
          aria-invalid={Boolean(actionData?.fieldErrors?.password) || undefined}
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
        <button type="submit" className="btn">
          Verander wachtwoord
        </button>
      </form>
    </div>
  );
}
