import { Link, Outlet, useLoaderData } from 'remix';
import { Department } from '@prisma/client';
import type { LoaderFunction } from 'remix';
import { db } from '~/utils/db.server';

type LoaderData = {
  departments: Department[];
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const departments = await db.department.findMany({
    where: { organisation: { slugName: params.organisationSlug as string } },
  });

  return { departments };
};

export default function OrganisationDepartments() {
  const { departments } = useLoaderData<LoaderData>();

  return (
    <div className="h-full flex">
      <div>
        <Link to="create" className="absolute top-0.5 right-2 btn btn-save">
          <i className="fas fa-plus"></i>
        </Link>
        <table>
          <thead>
            <th>Afdeling</th>
          </thead>
          <tbody>
            {departments.map((department) => (
              <tr key={department.id}>
                <td>{department.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
