import { Organisation, User } from '@prisma/client';
import { Link, LoaderFunction, Outlet, redirect, useLoaderData } from 'remix';
import Tab from '~/components/Tab';
import { db } from '~/utils/db.server';

type LoaderData = {
  employees: User[];
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const organisation = await db.organisation.findUnique({
    where: { slugName: params.organisationSlug as string },
  });
  const employees = await db.user.findMany({
    where: { organisationId: organisation?.id },
  });

  return { employees };
};

export default function Organisation() {
  const { employees } = useLoaderData<LoaderData>();

  return (
    <div className="h-full">
      <h3>Medewerkers</h3>
      <Link to="create" className="absolute top-0.5 right-2 btn btn-save">
        <i className="fas fa-plus"></i>
      </Link>
      <table>
        <thead>
          <th>Voornaam</th>
          <th>Achternaam</th>
          <th>Email</th>
          <th>Edit</th>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.firstName}</td>
              <td>{employee.lastName}</td>
              <td>{employee.email}</td>
              <td>
                <Link to={employee.id}>
                  <i className="fas fa-pencil-alt" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
