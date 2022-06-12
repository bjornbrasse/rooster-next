import clsx from 'clsx';
import { FC } from 'react';
import { NavLink } from 'remix';

interface TabProps {
  href: string;
  icon: string;
}

export const Tab: FC<TabProps> = ({ href, icon }) => {
  return (
    <NavLink
      className={({ isActive }) =>
        clsx(
          'flex h-12 w-12 items-center justify-center border-y border-l text-xl',
          {
            'rounded-l-lg border-blue-700 bg-blue-600 text-white dark:border-white dark:bg-transparent ':
              isActive,
            'border-gray-400 text-gray-400 dark:border-neutral-700 dark:text-neutral-700':
              !isActive,
          },
        )
      }
      to={href}
    >
      <i className={icon}></i>
    </NavLink>
  );
};

export const Tabs: FC & {
  Tab: React.FC<TabProps>;
} = ({ children }) => {
  return (
    <div
      id="tabs"
      className="flex h-full flex-col space-y-2 border-r-2 border-blue-800 py-4 pl-4 dark:border-white"
    >
      {children}
    </div>
  );
};

Tabs.Tab = Tab;
