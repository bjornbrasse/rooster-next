import { FC } from 'react';
import { useNavigate } from 'remix';

const TRL: FC<{ className?: string; to: string }> = ({
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
