import * as React from 'react';
import { ActionFunction, Form, json, redirect, useLoaderData } from 'remix';
import { BBLoader } from 'types';
import { sendPasswordResetToken } from '~/controllers/auth.server';
import { getUser } from '~/controllers/user.server';

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

    const isSent = await sendPasswordResetToken({ userId: userId ?? '' });

    return { isSent };
  }

  return { success: false };
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
