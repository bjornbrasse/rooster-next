import * as React from 'react';
import { Department, Organisation } from '@prisma/client';
import { LoaderFunction, useLoaderData, useLocation } from 'remix';
import { NavLink, Outlet } from 'remix';
import { db } from '~/utils/db.server';
import { classNames } from '~/utils/helpers';

type LoaderData = {
  department: Department | null;
  organisation: Organisation | null;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const { organisationSlug, departmentId } = params;

  const organisation = await db.organisation.findUnique({
    where: { slugName: organisationSlug ?? '' },
  });
  const department = await db.department.findUnique({
    where: { id: departmentId ?? '' },
  });

  return { department, organisation };
};

export default function AdminLayout() {
  const location = useLocation();
  const { department, organisation } = useLoaderData<LoaderData>();

  React.useEffect(() => {}, [location]);

  return (
    <div className="h-full flex">
      <div id="menu" className="w-1/4 lg:w-1/5 border-r-2 border-purple-800">
        {department ? (
          <h1>Test</h1>
        ) : (
          <div className="py-4 pr-4 flex flex-col">
            <NavLink
              to="employees"
              className={({ isActive }) =>
                classNames(
                  'w-full m-2 text-lg border-b border-gray-400',
                  `block ${isActive ? 'text-purple-300' : ''}`
                )
              }
            >
              <i className="fas fa-users mr-3"></i>
              Medewerkers
            </NavLink>
            <NavLink
              to="departments"
              className={({ isActive }) =>
                classNames(
                  'w-full m-2 text-lg border-b border-gray-400',
                  `block ${isActive ? 'text-purple-300' : ''}`
                )
              }
            >
              <i className="fas fa-square mr-4"></i>
              Afdelingen
            </NavLink>
          </div>
        )}
      </div>
      <div id="content" className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
