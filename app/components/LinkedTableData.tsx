import { Link } from 'remix';

interface IProps {
  href: string;
  className?: string;
}
const LinkedTableData: React.FC<IProps> = ({ children, className, href }) => {
  return (
    <td className={className}>
      <Link to={href}>{children}</Link>
    </td>
  );
};

export default LinkedTableData;
