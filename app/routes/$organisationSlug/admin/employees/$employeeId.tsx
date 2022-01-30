import { Link, Outlet } from 'remix';

export default function EmployeeLayout() {
  return (
    <div>
      <Link to="..">
        <i className="fas fa-times" />
      </Link>
      <h1>Employees</h1>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
