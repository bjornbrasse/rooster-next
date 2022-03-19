import clsx from "clsx";
import * as React from "react";
import { Link, Outlet } from "remix";

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
      <div className="w-1/4 pr-2 border-r-2 border-slate-500 overflow-hidden">
        <div
          className={clsx(
            "mb-2 text-lg text-neutral-600 tracking-widest border-b-2 border-sky-500",
            {
              // "bg-sky-300": true,
            }
          )}
        >
          {listTitle}
        </div>
        <div className="flex flex-col">
          {listItems.map(({ id, name }) => (
            <Link
              to={id}
              className="hover:bg-sky-100 cursor-pointer select-none"
              key={id}
            >
              {name}
            </Link>
          ))}
        </div>
      </div>
      <div className="grow shrink-0 border-2 border-sky-200">
        <Outlet />
      </div>
    </div>
  );
};
