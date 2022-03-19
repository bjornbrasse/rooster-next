import clsx from 'clsx';
import * as React from 'react';
import { Link, NavLink, Outlet } from 'remix';

type IProps = {
  listItems: { id: string; name: string }[];
  listTitle: string;
};

export const ColumnLookupView: React.FC<IProps> = ({
  children,
  listItems,
  listTitle,
}) => {
  return (
    <div className="h-full p-4 flex space-x-2">
      <div className="w-1/4 md:w-1/5 pr-2 border-r-2 border-slate-500 overflow-hidden">
        <div
          className={clsx(
            'mb-2 text-lg text-neutral-600 tracking-widest border-b-2 border-sky-500',
            {
              // "bg-sky-300": true,
            }
          )}
        >
          {listTitle}
        </div>
        <div className="flex flex-col">
          {listItems.map(({ id, name }) => (
            <NavLink
              to={id}
              className={({ isActive }) =>
                clsx('px-2 text-lg select-none', {
                  'bg-sky-400': isActive,
                  'hover:bg-sky-100 cursor-pointer': !isActive,
                })
              }
              key={id}
            >
              {name}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="px-4 grow shrink-0">
        <Outlet />
      </div>
    </div>
  );
};
