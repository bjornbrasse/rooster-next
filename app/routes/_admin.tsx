import { Organisation } from '@prisma/client';
import {
  Link,
  LoaderFunction,
  MetaFunction,
  Outlet,
  useLoaderData,
} from 'remix';
import { db } from '~/utils/db.server';

export const meta: MetaFunction = () => {
  return { title: 'Rooster | Admin' };
};

type LoaderData = {
  organisations: Organisation[];
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const organisations = await db.organisation.findMany();

  return { organisations };
};

export default function Admin() {
  const { organisations } = useLoaderData<LoaderData>();

  return (
    <div className="h-full flex">
      <div id="menu" className="w-1/4 lg:w-1/5 border-2 border-green-500">
        <h1>Organisaties</h1>
        {organisations.map((organisation) => (
          <ol
            key={organisation.id}
            className="hover:bg-blue-200 cursor-pointer"
          >
            <Link to={`organisations/${organisation.id}`}>
              {organisation.nameShort}
            </Link>
          </ol>
        ))}
      </div>
      <div className="flex-grow border-4 border-purple-900">
        <Outlet />
      </div>
    </div>
  );
}
