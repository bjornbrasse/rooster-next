import * as React from 'react';
import { User } from '@prisma/client';
import { getUsers } from '~/controllers/user.server';
import { LoaderFunction, Outlet, useLoaderData } from 'remix';
import { ColumnLookupView } from '~/components/column-lookp-view';

type LoaderData = {
  employees: User[];
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const { organisationId } = params;

  const employees = await getUsers({ organisationId: String(organisationId) });

  return { employees };
};

export default function OrganisationEmployees() {
  const { employees } = useLoaderData() as LoaderData;

  return (
    <ColumnLookupView
      listItems={employees.map(({ id, firstName, lastName }) => ({
        id,
        name: `${firstName} ${lastName}`,
      }))}
      listTitle="Medewerkers"
    >
      <Outlet />
    </ColumnLookupView>
  );
}
