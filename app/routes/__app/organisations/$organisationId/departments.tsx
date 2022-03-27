import { Department } from '@prisma/client';
import * as React from 'react';
import { Link, LoaderFunction, useLoaderData } from 'remix';
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
    <div className="h-full p-4">
      <div className="flex flex-col">
        {departments.map((department) => (
          <Link
            to={`/departments/${department.id}/`}
            className="border-grey-300 w-full cursor-pointer border hover:bg-sky-100"
            key={department.id}
          >
            {department.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
