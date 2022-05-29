import { FC, ReactNode } from 'react';

export const Frame: FC<{ buttons?: ReactNode; title: string }> = ({
  buttons,
  children,
  title,
}) => {
  return (
    <div>
      <div className="flex justify-between pr-1 pb-1">
        <p className="text-lg text-blue-600">{title}</p>
        {buttons}
      </div>
      <div
        id="frame"
        className="rounded-t-l-none flex flex-col rounded-md border border-stone-400 p-2"
      >
        {children}
      </div>
    </div>
  );
};
