import { FC } from 'react';

export const Header: FC = ({ children }) => {
  return (
    <div
      id="header"
      className="mb-12 flex items-center space-x-2 border-b-2 border-blue-700 p-2 text-xl dark:bg-blue-900"
    >
      {children}
    </div>
  );
};
