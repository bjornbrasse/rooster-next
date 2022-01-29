import { Organisation } from '@prisma/client';
import { Link, LoaderFunction, useLoaderData } from 'remix';
import { db } from '~/utils/db.server';

type LoaderData = {
  organisation: Organisation | null;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const organisation = await db.organisation.findUnique({
    where: { id: params.organisationId as string },
  });

  return { organisation };
};

export default function Organisation() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="h-full border border-red-500">
      <div id="header" className="p-4 flex items-center bg-gray-400">
        <Link to="/admin/organisations" className="btn btn-save mr-3">
          <i className="fas fa-chevron-left mr-3"></i>
          Organisaties
        </Link>
        <h1>{data?.organisation?.name}</h1>
      </div>
      <div className="container">
        <h2>{data?.organisation?.name}</h2>
      </div>
    </div>
  );
}
