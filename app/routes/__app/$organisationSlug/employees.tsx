import * as React from 'react';
import { Organisation, User } from '@prisma/client';
import { getUsers } from '~/controllers/user.server';
import { LoaderFunction, Outlet, useLoaderData, useMatches } from 'remix';
import { ColumnLookupView } from '~/components/column-lookp-view';
import { Await, BBLoader } from 'types';
import { useMatch } from 'react-router';

type LoaderData = {
  employees: Awaited<ReturnType<typeof getUsers>>;
};

export const loader: BBLoader<{ organisationSlug: string }> = async ({
  params,
}): Promise<LoaderData> => {
  const employees = await getUsers({
    organisationSlug: params.organisationSlug,
  });

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
