import dayjs from 'dayjs';
import { Link } from 'remix';

export default function Index() {
  return (
    <div className="m-8">
      <h1>Home page</h1>
      <ul className="mt-4">
        <li>
          <Link
            to={`planner?d=${dayjs().format('YYYY-MM-DD')}`}
            className="text-blue-600 underline"
          >
            planner
          </Link>
        </li>
      </ul>
    </div>
  );
}
