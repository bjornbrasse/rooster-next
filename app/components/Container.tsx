import * as React from 'react';

const Container: React.FC<{ flex?: 'row' | 'col'; padding?: boolean }> = ({
  children,
  flex = 'col',
  padding = true,
}) => {
  return (
    <div
      className={`h-full w-full ${padding ? 'p-8' : null} flex ${
        flex === 'col' ? 'flex-col' : null
      }`}
    >
      {children}
    </div>
  );
};

export default Container;
