import { Link } from 'remix';

export default function Index() {
  return (
    <div className="m-8">
      <h1>Home page</h1>
      <ul className="mt-4">
        <li>
          <Link to={'schedules'} className="text-blue-600 underline">
            Roosters
          </Link>
        </li>
      </ul>
    </div>
  );
}
