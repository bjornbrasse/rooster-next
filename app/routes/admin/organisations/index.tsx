import { Organisation } from '@prisma/client';
import { Link, LoaderFunction, useLoaderData } from 'remix';
import { db } from '~/utils/db.server';

type LoaderData = {
  organisations: Organisation[];
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const organisations = await db.organisation.findMany();

  return { organisations };
};

export default function OrganisationsRoute() {
  const { organisations } = useLoaderData<LoaderData>();

  return (
    <div className="h-full border border-red-600">
      <div
        id="header"
        className="p-4 flex justify-between items-center bg-gray-400"
      >
        <h1>Organisaties</h1>
        <Link to="create" className="btn btn-save">
          <i className="fas fa-plus"></i>
        </Link>
      </div>
      <table>
        <thead className="border-b-2 border-blue-800">
          <th>Organisatie</th>
          <th>Naam voluit</th>
          <th>Edit</th>
        </thead>
        <tbody>
          {organisations.map((organisation) => (
            <tr key={organisation.id} className="border-b border-gray-300">
              <td>{organisation.nameShort}</td>
              <td>{organisation.name}</td>
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
  );
}
