import { Organisation } from '@prisma/client';
import { Link, LoaderFunction, Outlet, redirect, useLoaderData } from 'remix';
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

  return (
    <div className="relative h-full flex flex-col">
      <div
        id="header"
        className="px-4 py-1 flex items-center bg-gray-300 border-b border-purple-800"
      >
        <h2>{organisation?.name}</h2>
      </div>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
