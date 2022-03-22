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

  console.log('gebruikers gevonden 2', user);

  const organisation = await db.organisation.findUnique({
    where: { slug: params.organisationSlug as string },
  });

  // if (!organisation) redirect('/');

  return { organisation, user };
};

export default function Organisation() {
  const { organisation } = useLoaderData<LoaderData>();

  const { departmentSlug, employeeId } = useParams();

  const data = useMatches().find(
    (m) => m.pathname === `/${organisation?.slug}/admin/departments`,
  )?.data as { departments: Department[] };
  const department = data?.departments.find((d) => d.slug === departmentSlug);

  return (
    <div className="relative flex h-full flex-grow flex-col">
      <div className="flex h-full border-b-4 border-purple-400">
        {!departmentSlug && (
          <div
            id="menu"
            className="w-1/5 border-r-2 border-purple-800 md:w-1/4"
          >
            <div className="flex flex-col py-4 pr-4">
              <NavLink
                to="employees"
                className={({ isActive }) =>
                  classNames(
                    'm-2 w-full border-b border-gray-400 text-lg',
                    `block ${isActive ? 'text-purple-300' : ''}`,
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
                    'm-2 w-full border-b border-gray-400 text-lg',
                    `block ${isActive ? 'text-purple-300' : ''}`,
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
