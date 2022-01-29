import { Link } from 'remix';

interface IProps {
  onClickHandler: () => void;
  to: string;
}

const Tab: React.FC<IProps> = ({ children, to }) => {
  return (
    <Link to={to} className="p-2 rounded-t-lg hover:bg-blue-300 cursor-pointer">
      <p>{children}</p>
    </Link>
  );
};

export default Tab;
