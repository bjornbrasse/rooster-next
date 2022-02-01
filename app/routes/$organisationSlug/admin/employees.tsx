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
import LinkedTableData from '~/components/LinkedTableData';
import UserTable from '~/components/tables/UserTable';

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

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-1/2 flex-grow px-3 py-5">
        <Link to="create" className="absolute top-1 right-1 btn btn-save">
          <i className="fas fa-plus"></i>
        </Link>
        <UserTable users={employees} />
      </div>
      <Outlet />
    </div>
  );
}
