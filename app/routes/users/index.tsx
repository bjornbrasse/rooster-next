import { User } from '@prisma/client';
import { Link, LoaderFunction, useLoaderData } from 'remix';
import { db } from '~/utils/db.server';

type LoaderData = {
  users: User[] | null;
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const users = await db.user.findMany();

  return { users };
};

export default function UsersRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <div className="flex justify-between">
        <h2>Gebruikers</h2>
        <Link to="create" className="btn btn-save rounded-full">
          +
        </Link>
      </div>

      <table>
        <thead className="border-b border-red-500">
          <th>Voornaam</th>
          <th>Achternaam</th>
          <th>Email</th>
        </thead>
        <tbody>
          {data.users?.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>
                <Link to={user.id}>
                  <i className="fas fa-pencil-alt" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
