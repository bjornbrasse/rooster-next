import { LoaderFunction, NavLink, useLoaderData, useMatches } from 'remix';
import { Link, Outlet } from 'remix';
import { getUserSecure } from '~/controllers/auth.server';
import UserMenu from '~/components/user-menu';
import { Breadcrumbs } from '~/components/breadcrumbs';
import { Breadcrumb, LoaderDataBase } from 'types';
import clsx from 'clsx';
import { useSchedule } from '~/contexts/schedule';
import { Header } from '~/components/header';
import { useEffect } from 'react';

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

  const breadcrumbs = useMatches()
    .filter((match) => match?.handle?.breadcrumb)
    .map((match) => match.handle.breadcrumb(match.data) as Breadcrumb);

  // .reduce((acc: Breadcrumb[], match) => {
  //   if (match.data?.breadcrumb) acc.push(match.data.breadcrumb() as Breadcrumb);

  //   // match.data?.breadcrumbs?.forEach((bc: Breadcrumb) => acc.push(bc));

  //   return acc;
  // }, []);

  return (
    <div className="dark  h-full ">
      <div className="flex h-full flex-col bg-white  text-white dark:bg-zinc-800">
        <div id="header">
          <div
            id="navbar"
            className="flex items-center justify-between bg-primary py-2 pl-4  pr-2 text-accent  dark:bg-sky-700 dark:text-white"
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
          {breadcrumbs.length > 0 && (
            <div className="border-b border-zinc-700 py-1 px-4 text-gray-400">
              {breadcrumbs.map((breadcrumb, index) => (
                <p key={index}>{breadcrumb.caption}</p>
              ))}
            </div>
            // <h1>Hallo</h1>
          )}
        </div>
        <div className="flex-grow" id="navbar-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
