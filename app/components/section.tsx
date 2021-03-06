import * as React from 'react';

export const Section: React.FC<{ caption: string }> = ({
  caption,
  children,
}) => {
  return (
    <>
      <div className="border-b-2 border-sky-500">
        <p className="ml-1 text-lg text-slate-400 text-bold tracking-wider">
          {caption}
        </p>
      </div>
      <div className="px-2">{children}</div>
    </>
  );
};
