import * as React from "react";

const Container: React.FC<{
  className?: string;
  flex?: "row" | "col";
  padding?: boolean;
}> = ({ children, className, flex = "col", padding = true }) => {
  return (
    <div
      className={`h-full w-full ${padding ? "p-4" : null} flex ${
        flex === "col" ? "flex-col" : null
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
