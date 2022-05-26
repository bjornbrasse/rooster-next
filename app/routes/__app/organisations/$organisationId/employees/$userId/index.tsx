import * as React from 'react';
import { ActionFunction, Form, json, redirect, useLoaderData } from 'remix';
import { BBLoader } from 'types';
import { setPasswordResetToken } from '~/controllers/auth.server';
import { getUser } from '~/controllers/user.server';
import { sendEmail } from '~/utils/email';
import { passwordResetEmail } from '~/utils/email/templates';
import { badRequest } from '~/utils/helpers';

type LoaderData = {
  user: Exclude<Awaited<ReturnType<typeof getUser>>, null>;
};

export const loader: BBLoader<{
  organisationSlug: string;
  userId: string;
}> = async ({ params, request }) => {
  const user = await getUser({ id: params.userId });

  if (!user) return redirect(`/${params.organisationSlug}`);

  return json({ user });
};

export const action: ActionFunction = async ({ request, params }) => {
  const action = (await request.formData()).get('_action');

  if (action === 'resetPassword') {
    const { userId } = params;
    console.log('SENDING MESSAGE 1');

    const response = await setPasswordResetToken({ userId: userId ?? '' });

    if (response.success) {
      const { user } = response;

      try {
        await sendEmail(
          [user.email],
          passwordResetEmail(
            user.firstName,
            `/auth/passwordReset?token=${user.passwordResetToken}`,
          ),
          'pwrt',
        );
      } catch (error) {
        return console.log('Er is iets fout gegaan', error);
      }
    }
    console.log('SENDING MESSAGE 2');

    return json({ isSent: true });
  }

  return badRequest({ success: false });
};

export default function OrganisationEmployee() {
  const { user } = useLoaderData() as LoaderData;

  return (
    <div>
      <p>Medewerker</p>
      <p>{user.firstName}</p>
      <p>{user.lastName}</p>
      <Form method="post">
        <button className="btn btn-save" name="_action" value="resetPassword">
          Reset Wachtwoord
        </button>
      </Form>
    </div>
  );
}
