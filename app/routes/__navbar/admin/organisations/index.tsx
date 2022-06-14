import { Organisation } from '@prisma/client';
import { LoaderFunction, useLoaderData } from 'remix';
import TRL from '~/components/table-row-with-navigation';
import { db } from '~/utils/db.server';
import { requireUser } from '~/controllers/auth.server';
import { Container } from '~/components/container';

type LoaderData = {
  organisations: Organisation[];
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  await requireUser(request, { isAdmin: true });

  const organisations = await db.organisation.findMany();

  return { organisations };
};

export default function Organisations() {
  const { organisations } = useLoaderData<LoaderData>();

  return (
    <Container>
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
              to={`/${organisation.slug}/employees`}
              className="cursor-pointer border-b border-gray-300 hover:bg-blue-300"
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
    </Container>
  );
}
