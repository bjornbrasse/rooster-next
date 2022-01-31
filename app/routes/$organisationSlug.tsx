import type { LoaderFunction } from 'remix';
import { Department, Organisation } from '@prisma/client';
import {
  Link,
  Outlet,
  redirect,
  useLoaderData,
  useMatches,
  useParams,
} from 'remix';
import { db } from '~/utils/db.server';

type LoaderData = {
  organisation: Organisation | null;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const organisation = await db.organisation.findUnique({
    where: { slugName: params.organisationSlug as string },
  });

  if (!organisation) redirect('/');

  return { organisation };
};

export default function Organisation() {
  const { organisation } = useLoaderData<LoaderData>();

  const { departmentId } = useParams();

  const data = useMatches().find(
    (m) => m.pathname === `/${organisation?.slugName}/admin/departments`
  )?.data as { departments: Department[] };
  const department = data?.departments.find((d) => d.id === departmentId);

  return (
    <div className="relative h-full flex flex-col">
      <div
        id="header"
        className="px-4 py-1 flex items-center bg-gray-300 border-b border-purple-800"
      >
        <Link to="/admin/organisations">
          <i className="fas fa-bars text-xl mr-2" />
        </Link>
        {organisation && (
          <Link to={`/${organisation.slugName}/admin/employees`}>
            <h2>{organisation?.name}</h2>
          </Link>
        )}
        {department && (
          <>
            <i className="fas fa-chevron-right mx-2" />
            <h2>{department.name}</h2>
          </>
        )}
      </div>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
