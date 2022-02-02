import { NavLink } from 'remix';
import { classNames } from '~/utils/helpers';

interface IProps {
  href: string;
  className?: string;
}
const LinkedTableData: React.FC<IProps> = ({ children, className, href }) => {
  return (
    <td className={className}>
      <NavLink
        to={href}
        className={({ isActive }) => classNames(isActive ? 'bg-green-400' : '')}
      >
        {children}
      </NavLink>
    </td>
  );
};

export default LinkedTableData;
