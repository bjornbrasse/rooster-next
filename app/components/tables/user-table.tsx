import { User } from '@prisma/client';
import { useState } from 'react';
import { Link } from 'remix';
import LinkedTableData from '../LinkedTableData';

type Sort = 'firstName' | 'lastName';

interface IProps {
  baseUrl: string;
  users: User[];
}

export const UserTable: React.FC<IProps> = ({ baseUrl, users }) => {
  const [order, setOrder] = useState<Sort>('firstName');

  return (
    <table className="w-full table-auto border-2 border-blue-600">
      <thead className="sticky top-0 border-b-2 border-gray-600 bg-red-300 text-left">
        <tr>
          <th onClick={() => setOrder('firstName')}>
            Voornaam
            {order === 'firstName' && <i className="fas fa-sort-down" />}
          </th>
          <th
            onClick={() => setOrder('lastName')}
            className="cursor-pointer border-r border-gray-400"
          >
            Achternaam
          </th>
          <th>Email</th>
          {/* <th>Edit</th> */}
        </tr>
      </thead>
      <tbody className="overflow-auto">
        {users
          .sort((a, b) => {
            if (order === 'firstName') {
              return a.firstName < b.firstName ? -1 : 0;
            }
            return a.lastName < b.lastName ? -1 : 0;
          })
          .map((user) => (
            <tr className="cursor-pointer hover:bg-blue-200" key={user.id}>
              <LinkedTableData href={`${baseUrl}/${user.id}`}>
                {user.firstName}
              </LinkedTableData>
              <LinkedTableData
                href={`${baseUrl}/${user.id}`}
                className="border-r border-gray-400 px-1"
              >
                {user.lastName}
              </LinkedTableData>
              <LinkedTableData href={`${baseUrl}/${user.id}`} className="px-1">
                {user.email}
              </LinkedTableData>
              <td className="text-right">
                <Link to={`${baseUrl}/${user.id}`}>
                  <i className="fas fa-pencil-alt" />
                </Link>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
