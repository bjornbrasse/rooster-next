import { json, Link, Outlet, useLoaderData } from 'remix';
import { BBLoader } from 'types';
import { Drawer } from '~/components/drawer';
import { List } from '~/components/list';
import { getDepartments } from '~/controllers/department';

type LoaderData = {
  departments: Awaited<ReturnType<typeof getDepartments>>;
};

export const loader: BBLoader<{ organisationId: string }> = async ({
  params,
}) => {
  const departments = await getDepartments({
    organisationId: params.organisationId,
  });

  return json<LoaderData>({ departments });
};

export default function DepartmentsLayout() {
  const { departments } = useLoaderData() as LoaderData;

  return (
    <div className="flex h-full">
      <Drawer>
        <List
          headerButtons={
            <Link to="create" className="btn btn-save">
              <i className="fas fa-plus"></i>
            </Link>
          }
          title="Afdelingen"
        >
          {departments.map(({ id, name }) => (
            <List.ListItem
              item={{ id, caption: name, to: (id: string) => `${id}/tasks` }}
              key={id}
            />
          ))}
        </List>
      </Drawer>
      <div className="w-full p-4">
        <Outlet />
      </div>
    </div>
  );
}
