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
  const [search, setSearch] = React.useState('');

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
        <form className="mb-2 relative flex items-center text-sky-400">
          <input
            type="text"
            name="search"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoeken..."
            className="w-full pl-2 pr-10 py-1 text-md border border-slate-300 placeholder-sky-400 rounded-lg focus:ring-0"
          />
          {search ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                setSearch('');
              }}
              className="w-6 h-6 absolute right-2 bg-slate-300 text-white text-bold rounded-full"
            >
              <i className="fas fa-times"></i>
            </button>
          ) : (
            <i className="fas fa-magnifying-glass absolute right-3 text-lg text-slate-400"></i>
          )}
        </form>
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
