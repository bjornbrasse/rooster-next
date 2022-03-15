import type { LoaderFunction } from 'remix';
import { Link, Outlet, useLoaderData, useParams } from 'remix';
import { db } from '~/utils/db.server';
import { Department } from '@prisma/client';
import LinkedTableData from '~/components/LinkedTableData';
import { useDialog } from '~/contexts/dialog';
import DepartmentForm from '~/components/forms/DepartmentForm';

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
  const { departmentId, organisationSlug } = useParams();
  const { openDialog } = useDialog();

  const addDepartmentHandler = () => {
    openDialog(
      'TVG',
      <DepartmentForm organisationSlug={String(organisationSlug)} />,
      'beschrijving'
    );
  };

  return (
    <>
      <div
        onClick={addDepartmentHandler}
        className="absolute top-0.5 right-2 btn btn-save"
      >
        <i className="fas fa-plus"></i>
      </div>
      <div className="h-full flex">
        {!departmentId && (
          <div className="flex-grow p-12 border-4 border-green-800">
            <table>
              <thead>
                <th>Afdeling</th>
                <th>Test</th>
              </thead>
              <tbody>
                {departments.map((department) => (
                  <tr
                    key={department.id}
                    className="hover:bg-blue-200 cursor-pointer"
                  >
                    <LinkedTableData
                      href={`/${organisationSlug}/${department.slugName}/`}
                    >
                      {department.name}
                    </LinkedTableData>
                    <LinkedTableData href={department.id}>test</LinkedTableData>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Outlet />
      </div>
    </>
  );
}