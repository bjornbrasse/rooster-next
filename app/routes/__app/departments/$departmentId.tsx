import { Department } from '@prisma/client';
import type { LoaderFunction } from 'remix';
import { redirect } from 'remix';
import { Outlet, useParams } from 'remix';
import Menu from '~/components/Menu';
import { getDepartment } from '~/controllers/department';

type LoaderData = {
  department: Department;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData | Response> => {
  const department = await getDepartment({
    departmentId: String(params.departmentId),
  });

  if (!department) return redirect('/');

  return { department };
};

export default function DepartmentLayout() {
  const { departmentId } = useParams();

  return (
    <div className="w-full flex">
      {/* <div id="menu" className="w-1/4 lg:w-1/5 bg-red-400">
        Tabs
      </div> */}
      <Menu>
        <Menu.Item
          href={`/departments/${departmentId}/employees`}
          icon="fas fa-users"
        >
          Medewerkers
        </Menu.Item>
        <Menu.Item
          href={`/departments/${departmentId}/plannings`}
          icon="fas fa-calendar"
        >
          Roosters
        </Menu.Item>
      </Menu>
      <Outlet />
    </div>
  );
}
