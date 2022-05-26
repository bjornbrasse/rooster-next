import { FC } from 'react';

export const Drawer: FC<{ className?: string }> = ({
  children,
  className = 'w-1/4 shrink-0 overflow-hidden border-r-2 border-stone-500 md:w-1/5',
}) => {
  return <div className={className}>{children}</div>;
};
