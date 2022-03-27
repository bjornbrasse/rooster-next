import { Organisation, User } from '@prisma/client';
import clsx from 'clsx';
import * as React from 'react';
import { Link, NavLink } from 'remix';
import { getUser } from '~/controllers/auth.server';
import { useSchedule } from '~/hooks/useSchedule';
import UserMenu from './user-menu';

export const Navbar: React.FC<{
  user: Awaited<ReturnType<typeof getUser>>;
}> = ({ user }) => {
  const { setShowSelectionDrawer } = useSchedule();

  return (
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
  );
};
