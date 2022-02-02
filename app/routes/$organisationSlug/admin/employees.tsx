import { Organisation, User } from '@prisma/client';
import type { LoaderFunction } from 'remix';
import { Outlet, useLoaderData, useMatches, useParams } from 'remix';
import { db } from '~/utils/db.server';
import UserTable from '~/components/tables/UserTable';
import { useDialog } from '~/contexts/dialog';
import UserForm from '~/components/forms/UserForm';

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
  const { openDialog } = useDialog();

  const { organisationSlug } = useParams();
  const { organisation } = useMatches().find(
    (m) => m.pathname === `/${organisationSlug}`
  )?.data as {
    organisation: Organisation;
  };

  const addUserHandler = () => {
    openDialog(
      'maak een gebruiker aan',
      <UserForm organisationId={organisation.id} />
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-1/2 flex-grow px-3 py-5">
        <div
          onClick={addUserHandler}
          className="absolute top-1 right-1 btn btn-save bg-red-600"
        >
          <i className="fas fa-plus"></i>
        </div>
        {/* <Link
          to="create"
          className="absolute top-1 right-1 btn btn-save bg-red-600"
        >
          <i className="fas fa-plus"></i>
        </Link> */}
        <UserTable users={employees} />
      </div>
      <Outlet />
    </div>
  );
}
