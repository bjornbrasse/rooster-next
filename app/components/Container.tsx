import * as React from 'react';

const Container: React.FC<{ flex?: 'row' | 'col'; padding?: boolean }> = ({
  children,
  flex,
  padding = false,
}) => {
  return (
    <div
      className={`h-full ${padding ? 'p-8' : null} flex ${
        flex === 'col' ? 'flex-col' : null
      }`}
    >
      {children}
    </div>
  );
};

export default Container;
