import clsx from 'clsx';
import { FC } from 'react';
import { useDrag } from 'react-dnd';
import { DnDItemTypes } from '~/utils/dnd';

export const DraggableListItem: FC<{
  item: any;
  type: string;
}> = ({ children, item, type }) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type,
      item: { item },
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
