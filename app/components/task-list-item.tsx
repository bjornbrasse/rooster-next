import { Task } from '@prisma/client';
import clsx from 'clsx';
import React, { FC } from 'react';
import { useDrag } from 'react-dnd';
import { DnDItemTypes } from '~/utils/dnd';

export const TaskListItem: FC<{ task: Task }> = ({ task }) => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: DnDItemTypes.TASK,
      item: { task },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [],
  );

  return (
    <li
      className={`cursor-pointer px-1 ${
        isDragging ? 'hover:bg-red-400' : null
      } hover:bg-blue-400`}
      key={task.id}
      ref={dragRef}
    >
      {task.name}
    </li>
  );
};
