import { Menu, Transition } from '@headlessui/react';
import { Organisation, User } from '@prisma/client';
import { Fragment } from 'react';
import { LoaderFunction, NavLink, useLoaderData, useMatches } from 'remix';
import { Link, Outlet } from 'remix';
import { useSchedule } from '~/hooks/useSchedule';
import { getUser } from '~/controllers/auth.server';
import UserMenu from '~/components/user-menu';
import * as React from 'react';
import Navigator from '~/components/Navigator';
import { Breadcrumbs } from '~/components/breadcrumbs';
import { Breadcrumb, LoaderDataBase } from 'types';

type LoaderData = LoaderDataBase & {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const user = await getUser(request);

  // Dit is om de breadcrumbs te testen
  // const breadcrumbs: Breadcrumb[] = [
  //   {
  //     caption: 'Bjorn',
  //     to: `/organisations/Bjorn`,
  //   },
  //   {
  //     caption: 'Cindy',
  //     to: `/departments/Cindy`,
  //   },
  // ];

  const breadcrumb: Breadcrumb = {
    caption: 'Bjorn',
    to: `/organisations/Bjorn`,
  };

  return { breadcrumb, user };
};

export default function App() {
  const { setShowSelectionDrawer } = useSchedule();

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
      <div
        id="header"
        className="flex h-12 items-center justify-between bg-primary px-4"
      >
        <Link
          to={user ? `/${user.organisation.slug}/${user.firstName}` : '/home'}
          className="cursor-pointer text-3xl font-bold text-accent"
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
                  `px-2 py-1 ${
                    isActive ? 'bg-accent' : 'text-white'
                  } rounded-lg`
                }
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      </div>
      <div id="Content" className="flex h-full flex-col bg-gray-100">
        <Breadcrumbs
          breadcrumbs={breadcrumbs.map((bc) => ({
            ...bc,
            to: typeof bc.to === 'string' ? bc.to : bc.to(),
          }))}
        />
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
