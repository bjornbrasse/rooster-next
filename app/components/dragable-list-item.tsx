import { Task, User } from '@prisma/client';
import clsx from 'clsx';
import { FC } from 'react';
import { useDrag } from 'react-dnd';
import { DnDItemTypes } from '~/utils/dnd';

export const DraggableListItem: FC<{
  item: {id: string; firstName: string; lastName: string} | Task;
  type: string;
}> = ({ children, item, type }) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type,
      item,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [],
  );

  return (
    <li
      className={clsx('cursor-pointer px-1 hover:bg-blue-400', {
        'bg-red-400': isDragging,
      })}
      key={item.id}
      ref={dragRef}
    >
      {children}
    </li>
  );
};
