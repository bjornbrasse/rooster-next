import { LoaderFunction, NavLink } from 'remix';
import { Department, Organisation, User } from '@prisma/client';
import {
  Link,
  Outlet,
  redirect,
  useLoaderData,
  useMatches,
  useParams,
} from 'remix';
import { db } from '~/utils/db.server';
import { classNames } from '~/utils/helpers';
import { requireUser } from '~/controllers/auth.server';

type LoaderData = {
  organisation: Organisation | null;
  user: User | null;
};

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData> => {
  const user = await requireUser(request);

  const organisation = await db.organisation.findUnique({
    where: { slugName: params.organisationSlug as string },
  });

  if (!organisation) redirect('/');

  return { organisation, user };
};

export default function Organisation() {
  const { organisation } = useLoaderData<LoaderData>();

  const { departmentSlug, employeeId } = useParams();

  const data = useMatches().find(
    (m) => m.pathname === `/${organisation?.slugName}/admin/departments`
  )?.data as { departments: Department[] };
  const department = data?.departments.find(
    (d) => d.slugName === departmentSlug
  );

  return (
    <div className="relative h-full flex flex-col">
      <div className="h-full flex border-b-4 border-purple-400">
        {!departmentSlug && (
          <div
            id="menu"
            className="w-1/5 md:w-1/4 border-r-2 border-purple-800"
          >
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
          </div>
        )}
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
