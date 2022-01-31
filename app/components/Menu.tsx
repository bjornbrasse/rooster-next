import * as React from 'react';
import { NavLink } from 'remix';
import { classNames } from '~/utils/helpers';

interface IMenu {
  className?: string;
}

const Menu: React.FC<IMenu> & { Item: React.FC<IMenuItem> } = ({
  children,
  className,
}) => {
  return (
    <div
      className={
        className ?? 'w-1/4 lg:w-1/5 bg-gray-100 border-r-2 border-purple-900'
      }
    >
      {children}
    </div>
  );
};

interface IMenuItem {
  href: string;
  icon: string;
}

const MenuItem: React.FC<IMenuItem> = ({ children, href, icon }) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        classNames(
          isActive ? 'bg-blue-400' : null,
          'px-4 py-2 flex items-center text-lg hover:bg-purple-200 cursor-pointer'
        )
      }
    >
      <i className={`${icon} mr-2`}></i>
      {children}
    </NavLink>
  );
};

Menu.Item = MenuItem;

export default Menu;
