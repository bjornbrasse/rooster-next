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
import { Await, BBLoader } from 'types';
import { useMatch } from 'react-router';
import { Drawer } from '~/components/drawer';
import { List } from '~/components/list';
import clsx from 'clsx';
import { userWithFullName, WithFullName } from '~/utils/user';

type LoaderData = {
  employees: Awaited<ReturnType<typeof getUsers>>;
};

export const loader: BBLoader<{ organisationId: string }> = async ({
  params,
}) => {
  const employees = await getUsers({
    organisationId: params.organisationId,
  });

  return { employees };
};

export default function OrganisationEmployees() {
  const { employees } = useLoaderData() as LoaderData;

  return (
    <div className="flex h-full">
      <Drawer>
        <List
          headerButtons={
            <Link to="create" className="btn btn-save">
              <i className="fas fa-plus"></i>
            </Link>
          }
          title={'Medewerkers'}
        >
          {employees.map(({ id, fullName }) => (
            <List.ListItem
              item={{ id, caption: firstName, to: (id: string) => `${id}` }}
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
