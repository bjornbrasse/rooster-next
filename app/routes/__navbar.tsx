import { Menu, Transition } from '@headlessui/react';
import { Organisation, User } from '@prisma/client';
import { Fragment } from 'react';
import { LoaderFunction, NavLink, useLoaderData, useMatches } from 'remix';
import { Link, Outlet } from 'remix';
import { getUserSecure } from '~/controllers/auth.server';
import UserMenu from '~/components/user-menu';
import * as React from 'react';
import Navigator from '~/components/Navigator';
import { Breadcrumbs } from '~/components/breadcrumbs';
import { Breadcrumb, LoaderDataBase } from 'types';
import clsx from 'clsx';
import { useSchedule } from '~/contexts/schedule';

type LoaderData = LoaderDataBase & {
  user: Awaited<ReturnType<typeof getUserSecure>>;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const user = await getUserSecure(request);

  return { user };
};

export default function Navbar() {
  const { setShowSelectionDrawer } = useSchedule();

  const data = useLoaderData() as LoaderData;
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
    <div className="dark flex h-full flex-col">
      <div
        id="header"
        className="flex items-center justify-between bg-primary py-2 pl-4 pr-2 text-accent  dark:bg-sky-700 dark:text-white"
      >
        <Link
          to={
            user?.organisation
              ? `/${user.organisation.slug}/${user.firstName}`
              : '/home'
          }
          className="cursor-pointer text-3xl font-bold"
        >
          Rooster
        </Link>
        <div className="flex items-center">
          <button
            onClick={(prev) => setShowSelectionDrawer(!!prev)}
            className="mr-2 h-8 w-8 rounded-full bg-gray-300"
          >
            <i className="fas fa-calendar-plus"></i>
          </button>
          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <NavLink
                to="/auth/login"
                style={({ isActive }) => ({
                  display: 'block',
                  margin: '1rem 0',
                  color: isActive ? 'red' : '',
                })}
                className={({ isActive }) =>
                  clsx(`px-2 py-1 text-white`, {
                    'bg-accent': isActive,
                  })
                }
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      </div>
      <div id="Content" className="flex h-full flex-col bg-gray-100">
        {breadcrumbs.length > 0 && (
          <Breadcrumbs
            breadcrumbs={breadcrumbs.map((bc) => ({
              ...bc,
              to: typeof bc.to === 'string' ? bc.to : bc.to(),
            }))}
          />
        )}
        <div className="flex-grow bg-white text-white dark:bg-zinc-800">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
