import React from "react";
import { useNavigate } from "remix";

const TRL: React.FC<{ className?: string; to: string }> = ({
  children,
  className,
  to,
}) => {
  const navigate = useNavigate();

  const clickHandler = () => {
    navigate(to);
  };

  return (
    <tr onClick={clickHandler} className={className}>
      {children}
    </tr>
  );
};

export default TRL;
