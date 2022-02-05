import { Organisation, User } from '@prisma/client';
import type { LoaderFunction, MetaFunction } from 'remix';
import {
  Outlet,
  useLoaderData,
  useLocation,
  useMatches,
  useParams,
  redirect,
} from 'remix';
import { db } from '~/utils/db.server';
import UserTable from '~/components/tables/UserTable';
import { useDialog } from '~/contexts/dialog';
import UserForm from '~/components/forms/UserForm';
import { findOrganisation } from '~/controllers/organisation';
import { getOrganisationEmployees } from '~/controllers/user';

export const meta: MetaFunction = () => {
  return {
    title: 'Rooster | Employees',
    description: `Enjoy the bla bla bla`,
  };
};

type LoaderData = {
  employees: User[];
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const employees = await getOrganisationEmployees({
    organisationSlug: params.organisationSlug,
  });

  return { employees };
};

export default function EmployeesLayout() {
  const { employees } = useLoaderData<LoaderData>();
  const { openDialog, closeDialog } = useDialog();

  const location = useLocation();

  const { organisationSlug } = useParams();
  const { organisation } = useMatches().find(
    (m) => m.pathname === `/${organisationSlug}`
  )?.data as {
    organisation: Organisation;
  };

  const addUserHandler = () => {
    openDialog(
      'maak een gebruiker aan',
      <UserForm
        onSaved={(user: User) => {
          closeDialog();
          redirect(`/${organisationSlug}/admin/employees/${user.id}`);
        }}
        organisationId={organisation.id}
        redirectTo={`/${organisation.slugName}/admin/employees/%userId%`}
      />
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative h-1/2 px-3 py-5">
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
        <UserTable
          baseUrl={`/${organisationSlug}/admin/employees`}
          users={employees}
        />
      </div>
      <div className="border-4 border-red-800">
        <Outlet />
      </div>
    </div>
  );
}
