import { Organisation } from '@prisma/client';
import { Link, LoaderFunction, Outlet, redirect, useLoaderData } from 'remix';
import Tab from '~/components/Tab';
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
    <div className="flex flex-col border border-red-500">
      <div id="header" className="p-4 flex items-center bg-gray-300">
        <h1>{data?.organisation?.name}</h1>
      </div>
      <div className="flex-grow p-2 border-4 border-green-400">
        <div id="tabs" className="px-2 flex border-b border-blue-800">
          <Tab onClickHandler={() => redirect('employees')} to="employees">
            Medewerkers
          </Tab>
          <Tab onClickHandler={() => redirect('departments')} to="departments">
            Afdelingen
          </Tab>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
