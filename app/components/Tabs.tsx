import * as React from "react";
import { NavLink } from "remix";

const Tab: React.FC<{ className?: string; to: string }> = ({
  children,
  className,
  to,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-2 py-1 flex ${
          isActive ? "bg-primary text-accent" : "bg-gray-300"
        } rounded-t-lg ${className}`
      }
    >
      {children}
    </NavLink>
  );
};

const Tabs: React.FC & {
  Tab: React.FC<{ className?: string; to: string }>;
} = ({ children }) => {
  return (
    <div
      id="Tabs"
      className="px-2 pt-3 flex space-x-1 items-end border-b-2 border-slate-500"
    >
      {children}
    </div>
  );
};

Tabs.Tab = Tab;

export default Tabs;
