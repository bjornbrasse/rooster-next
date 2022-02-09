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

export default function OrganisationLayout() {
  const { organisation } = useLoaderData<LoaderData>();

  const { departmentSlug, employeeId } = useParams();

  const data = useMatches().find(
    (m) => m.pathname === `/${organisation?.slugName}/${departmentSlug}`
  )?.data as { department: Department };

  const department = data?.department;

  return (
    <div className="relative h-full flex flex-col">
      <div
        id="header"
        className="px-4 py-1 flex items-center text-md bg-gray-200 border-b border-primary"
      >
        <Link to="/organisations">
          <i className="fas fa-bars mr-3" />
        </Link>
        {organisation && (
          <>
            {/* <Link to={`/${organisation.slugName}/employees`}> */}
            <Link to={`/organisations`}>
              <p>{organisation.name}</p>
            </Link>
            {department && (
              <>
                <i className="fas fa-chevron-right mx-2 text-sm" />
                <Link to={`/${organisation.slugName}/departments`}>
                  <p>{department.name}</p>
                </Link>
              </>
            )}
          </>
        )}
      </div>

      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
