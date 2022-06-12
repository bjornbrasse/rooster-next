import React from 'react';
import { json, LoaderFunction, redirect, useLoaderData } from 'remix';
import { BBLoader } from 'types';
import { requireUser } from '~/controllers/auth.server';

type LoaderData = {
  user: Awaited<ReturnType<typeof requireUser>>;
};

export const loader: BBLoader<{ organisationSlug: string }> = async ({
  request,
  params,
}) => {
  const user = await requireUser(request, {
    redirectTo: `/${params.organisationSlug}/my-planning`,
  });

  if (!user) return redirect('/home');

  return json({ user });
};

export default function MyPlanning() {
  const { user } = useLoaderData() as LoaderData;

  return (
    <div>
      <h1>Hoi</h1>
      <p>{user.firstName}</p>
    </div>
  );
}
