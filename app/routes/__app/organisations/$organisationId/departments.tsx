import { Department } from '@prisma/client';
import * as React from 'react';
import { Link, LoaderFunction, useLoaderData } from 'remix';
import { Drawer } from '~/components/drawer';
import { List } from '~/components/list';
import { getDepartments } from '~/controllers/department';

type LoaderData = {
  departments: Department[];
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const departments = await getDepartments({
    organisationId: String(params.organisationId),
  });

  return { departments };
};

export default function Departments() {
  const { departments } = useLoaderData<LoaderData>();

  return (
    <div className="flex h-full">
      <Drawer>
        <List
          headerButtons={
            <Link to="new" className="btn btn-save">
              <i className="fas fa-plus"></i>
            </Link>
          }
          title="Afdelingen"
        >
          {departments.map(({ id, name }) => (
            <List.ListItem item={{ id, caption: name }} key={id} />
          ))}
        </List>
      </Drawer>
    </div>
  );
}
