import { redirect, useActionData } from 'remix';
import type { ActionFunction } from 'remix';
import { badRequest } from '~/utils/helpers';
import { getUserPasswordReset } from '~/controllers/auth.server';
import { sendEmail } from '~/utils/sendEmail';
import { passwordResetEmail } from '~/utils/emailTemplates';

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email: string | undefined;
  };
  fields?: {
    email: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get('email');
  if (typeof email !== 'string') {
    return badRequest<ActionData>({
      formError: `Form not submitted correctly.`,
    });
  }

  console.log('getting here');

  const user = await getUserPasswordReset({ email });

  if (!user) return redirect('/login');

  sendEmail(
    [user.email],
    passwordResetEmail(
      user.firstName,
      `/auth/passwordReset?token=${user.passwordResetToken}`
    ),
    'pwrt'
  );

  return redirect('/auth/login');
};

export default function PasswordResetRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="container">
      <div className="card flex flex-col bg-white">
        <h1 className="mb-4 font-bold">Aanvragen wachtwoord-reset</h1>
        <form method="POST">
          <label htmlFor="email-input">Email</label>
          <input
            id="email-input"
            name="email"
            defaultValue={actionData?.fields?.email}
            type="email"
            className="w-full mb-2 block"
            aria-invalid={Boolean(actionData?.fieldErrors?.email) || undefined}
            aria-describedby={
              actionData?.fieldErrors?.email ? 'email-error' : undefined
            }
          />

          <button type="submit" className="btn">
            Mail Password Reset Token
          </button>
        </form>
      </div>
    </div>
  );
}
