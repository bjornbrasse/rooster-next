import { Menu, Transition } from '@headlessui/react';
import { Organisation, User } from '@prisma/client';
import { Fragment } from 'react';
import { LoaderFunction, NavLink, useLoaderData, useMatches } from 'remix';
import { Link, Outlet } from 'remix';
import { getUser } from '~/controllers/auth.server';
import UserMenu from '~/components/user-menu';
import * as React from 'react';
import Navigator from '~/components/Navigator';
import { Breadcrumbs } from '~/components/breadcrumbs';
import { Breadcrumb, LoaderDataBase } from 'types';
import { Navbar } from '~/components/navbar';

type LoaderData = LoaderDataBase & {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const user = await getUser(request);

  return { user };
};

export default function App() {
  const data = useLoaderData<LoaderData>();
  const user = data?.user;

  const breadcrumbs = useMatches().reduce((acc: Breadcrumb[], match) => {
    if (match.data?.breadcrumb) acc.push(match.data.breadcrumb as Breadcrumb);

    match.data?.breadcrumbs?.forEach((bc: Breadcrumb) => acc.push(bc));

    return acc;
  }, []);

  React.useEffect(() => {
    console.log('breadcrumbs:', breadcrumbs);
  }, breadcrumbs);

  return (
    <div className="flex h-full flex-col">
      <Navbar user={user} />
      <div id="Content" className="flex h-full flex-col bg-gray-100">
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            breadcrumbs={breadcrumbs.map((bc) => ({
              ...bc,
              to: typeof bc.to === 'string' ? bc.to : bc.to(),
            }))}
          />
        )}
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
