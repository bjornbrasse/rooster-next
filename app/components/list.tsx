import clsx from 'clsx';
import { FC } from 'react';
import { NavLink } from 'remix';

export const List: FC<{ headerButtons?: JSX.Element; title?: string }> & {
  ListItem: React.FC<ListItemProps>;
} = ({ children, headerButtons, title }) => {
  return (
    <div className="relative flex h-full flex-col">
      {title && (
        <div className="flex items-center justify-between border-b-2 border-blue-400 bg-stone-300 p-1">
          <p className="text-xl">{title}</p>
          {headerButtons}
        </div>
      )}
      <div className="flex h-full flex-col p-2">{children}</div>
    </div>
  );
};

type ListItemProps = {
  item: { caption: string; id: string; to: (id: string) => string };
};

export const ListItem: FC<ListItemProps> = ({ item: { caption, id, to } }) => {
  return (
    <NavLink
      to={to(id)}
      className={({ isActive }) =>
        clsx('select-none rounded-lg px-2 text-lg', {
          'bg-sky-400 py-1': isActive,
          'cursor-pointer hover:bg-sky-100': !isActive,
        })
      }
      key={id}
    >
      {caption}
    </NavLink>
  );
};

List.ListItem = ListItem;
