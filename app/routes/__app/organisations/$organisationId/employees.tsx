import * as React from 'react';
import { Organisation, User } from '@prisma/client';
import { getUsers } from '~/controllers/user.server';
import {
  Link,
  LoaderFunction,
  NavLink,
  Outlet,
  useLoaderData,
  useMatches,
} from 'remix';
import { ColumnLookupView } from '~/components/column-lookp-view';
import { Await, BBLoader } from 'types';
import { useMatch } from 'react-router';
import { Drawer } from '~/components/drawer';
import { List } from '~/components/list';
import clsx from 'clsx';
import { useParams } from 'remix';

type LoaderData = {
  employees: Awaited<ReturnType<typeof getUsers>>;
};

export const loader: BBLoader<{ organisationId: string }> = async ({
  params,
}): Promise<LoaderData> => {
  const employees = await getUsers({
    organisationId: params.organisationId,
  });

  return { employees };
};

export default function OrganisationEmployees() {
  const { employees } = useLoaderData() as LoaderData;
  const {} = useParams();

  return (
    <div className="flex h-full">
      <Drawer>
        <List
          headerButtons={
            <Link to="new" className="btn btn-save">
              <i className="fas fa-plus"></i>
            </Link>
          }
          title={'Medewerkers'}
        >
          {employees.map(({ id, firstName }) => (
            <List.ListItem
              item={{ id, caption: firstName, to: (id: string) => `` }}
              key="id"
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
