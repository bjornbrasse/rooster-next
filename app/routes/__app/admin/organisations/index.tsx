import { Organisation } from '@prisma/client';
import { Link, LoaderFunction, redirect, useLoaderData } from 'remix';
import { can, userIsAdmin } from '~/controllers/access.server';
import { requireUser } from '~/controllers/auth.server';
import { db } from '~/utils/db.server';

type LoaderData = {
  organisations: Organisation[];
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  await userIsAdmin(request, '/home');

  const organisations = await db.organisation.findMany();

  return { organisations };
};

export default function Organisations() {
  const { organisations } = useLoaderData<LoaderData>();

  return (
    <div className="h-full flex flex-col">
      <div
        id="header"
        className="px-4 py-1 flex justify-between items-center bg-gray-300"
      >
        <h1>Organisaties</h1>
        <Link to="create" className="btn btn-save">
          <i className="fas fa-plus"></i>
        </Link>
      </div>
      <div className="flex-grow p-12">
        <table>
          <thead className="border-b-2 border-blue-800">
            <th>Organisatie</th>
            <th>Naam voluit</th>
            <th>Edit</th>
          </thead>
          <tbody>
            {organisations.map((organisation) => (
              <tr
                key={organisation.id}
                className="border-b border-gray-300 hover:bg-blue-300 cursor-pointer"
              >
                <td>
                  <Link to={`/${organisation.slugName}/admin/employees`}>
                    {organisation.nameShort}
                  </Link>
                </td>
                <td>
                  <Link to={`/${organisation.slugName}/admin/employees`}>
                    {organisation.name}
                  </Link>
                </td>
                <td>
                  <Link to={organisation.id}>
                    <i className="fas fa-pencil-alt"></i>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
