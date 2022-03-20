import { Organisation } from '@prisma/client';
import { NavigationType } from 'react-router';
import { Link, LoaderFunction, useLoaderData, useNavigate } from 'remix';
import TRL from '~/components/TRL';
import { db } from '~/utils/db.server';
import Navigator from '~/components/Navigator';
import { requireUser } from '~/controllers/auth.server';

type LoaderData = {
  organisations: Organisation[];
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const user = requireUser(request, { isAdmin: true });

  const organisations = await db.organisation.findMany();

  return { organisations };
};

export default function Organisations() {
  const { organisations } = useLoaderData<LoaderData>();

  return (
    <div className="w-full h-full flex flex-col">
      <Navigator caption="Organisaties" />
      {/* <div
        id="header"
        className="px-4 py-1 flex justify-between items-center bg-gray-300"
      >
        <h1>Organisaties</h1>
        <Link to="create" className="btn btn-save">
          <i className="fas fa-plus"></i>
        </Link>
      </div> */}
      <div className="flex-grow p-12">
        <table>
          <thead className="border-b-2 border-blue-800">
            <tr>
              <th>Organisatie</th>
              <th>Naam voluit</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {organisations.map((organisation) => (
              <TRL
                to={`${organisation.id}/departments`}
                className="border-b border-gray-300 hover:bg-blue-300 cursor-pointer"
                key={organisation.id}
              >
                <td>{organisation.nameShort}</td>
                <td>{organisation.name}</td>
                <td>
                  <i className="fas fa-pencil-alt"></i>
                </td>
              </TRL>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
