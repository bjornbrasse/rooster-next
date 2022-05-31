import clsx from 'clsx';
import { forwardRef, ReactNode } from 'react';

export const Frame = forwardRef<
  HTMLInputElement,
  {
    buttons?: ReactNode;
    canDrop?: boolean;
    isHovering?: boolean;
    title: string;
  }
>(({ buttons, canDrop, children, isHovering, title }, dropRef) => {
  return (
    <div id="frame">
      <div className="flex justify-between pr-1 pb-1">
        <p className="text-lg text-blue-600">{title}</p>
        {buttons}
      </div>
      <div
        className={clsx(
          'flex max-h-48 min-h-[36px] flex-col overflow-auto rounded-md border border-stone-400 p-2',
          {
            'bg-red-600': isHovering && !canDrop,
            'bg-green-400': isHovering && canDrop,
          },
        )}
        ref={dropRef}
      >
        {children}
      </div>
    </div>
  );
});
