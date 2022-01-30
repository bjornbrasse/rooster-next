import * as React from 'react';
import { User } from '@prisma/client';
import {
  Link,
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
} from 'remix';
import { db } from '~/utils/db.server';
import { unstable_useKeyDown } from '@reach/combobox';

type Sort = 'firstName' | 'lastName';

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

export default function EmployeesLayout() {
  const { employees } = useLoaderData<LoaderData>();
  const [order, setOrder] = React.useState<Sort>('firstName');

  interface IProps {
    href: string;
    className?: string;
  }
  const LinkedCell: React.FC<IProps> = ({ children, className, href }) => {
    return (
      <td className={className}>
        <Link to={href}>{children}</Link>
      </td>
    );
  };
  return (
    <div className="h-full flex">
      <div className="relative w-1/2 flex-grow px-3 py-5 border-r-2 border-purple-800">
        <Link to="create" className="absolute top-1 right-1 btn btn-save">
          <i className="fas fa-plus"></i>
        </Link>
        <table className="w-full table-auto">
          <thead className="text-left border-b-2 border-gray-600">
            <th onClick={() => setOrder('firstName')}>
              Voornaam
              {order === 'firstName' && <i className="fas fa-sort-down" />}
            </th>
            <th
              onClick={() => setOrder('lastName')}
              className="border-r border-gray-400 cursor-pointer"
            >
              Achternaam
            </th>
            <th>Email</th>
            {/* <th>Edit</th> */}
          </thead>
          <tbody>
            {employees
              .sort((a, b) => {
                if (order === 'firstName') {
                  return a.firstName < b.firstName ? -1 : 0;
                }
                return a.lastName < b.lastName ? -1 : 0;
              })
              .map((employee) => (
                <tr
                  className="hover:bg-blue-200 cursor-pointer"
                  key={employee.id}
                >
                  <LinkedCell href={employee.id}>
                    {employee.firstName}
                  </LinkedCell>
                  <LinkedCell
                    href={employee.id}
                    className="px-1 border-r border-gray-400"
                  >
                    {employee.lastName}
                  </LinkedCell>
                  <LinkedCell href={employee.id} className="px-1">
                    {employee.email}
                  </LinkedCell>
                  <td className="text-right">
                    <Link to={employee.id}>
                      <i className="fas fa-pencil-alt" />
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Outlet />
    </div>
  );
}
