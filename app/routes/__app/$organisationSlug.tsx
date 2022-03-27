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
import { BBLoader, Breadcrumb } from 'types';

type LoaderData = {
  organisation: Organisation;
  user: User | null;
};

export const loader: BBLoader<{ organisationSlug: string }> = async ({
  params: { organisationSlug: slug },
  request,
}): Promise<LoaderData | Response> => {
  const user = await requireUser(request);

  const organisation = await db.organisation.findUnique({
    where: { slug },
  });

  if (!organisation) return redirect('/');

  return { organisation, user };
};

export default function OrganisationLayout() {
  const { organisation } = useLoaderData<LoaderData>();

  const { departmentSlug, organisationSlug } = useParams();

  const data = useMatches().find(
    (m) => m.pathname === `/${organisationSlug}/${departmentSlug}`,
  )?.data as { department: Department };

  const department = data?.department;

  return (
    <div className="relative flex h-full flex-col">
      <div
        id="header"
        className="text-md flex items-center border-b border-primary bg-gray-200 px-4 py-1"
      >
        <Link to="/organisations">
          <i className="fas fa-bars mr-3" />
        </Link>
        {organisation && (
          <>
            {/* <Link to={`/${organisation.slug}/employees`}> */}
            <Link to={`/organisations`}>
              <p>{organisation.name}</p>
            </Link>
            {department && (
              <>
                <i className="fas fa-chevron-right mx-2 text-sm" />
                <Link to={`/${organisation.slug}/departments`}>
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
