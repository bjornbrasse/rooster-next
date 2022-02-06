import { Outlet, useParams } from 'remix';
import Menu from '~/components/Menu';

export default function DepartmentLayout() {
  const { organisationSlug, departmentId } = useParams();

  return (
    <div className="w-full flex">
      {/* <div id="menu" className="w-1/4 lg:w-1/5 bg-red-400">
        Tabs
      </div> */}
      <Menu>
        <Menu.Item
          href={`/${organisationSlug}/admin/departments/${departmentId}/employees`}
          icon="fas fa-users"
        >
          Medewerkers
        </Menu.Item>
        <Menu.Item
          href={`/${organisationSlug}/admin/departments/${departmentId}/plannings`}
          icon="fas fa-calendar"
        >
          Plannings
        </Menu.Item>
      </Menu>
      <Outlet />
    </div>
  );
}
