import { User } from '@prisma/client';
import * as React from 'react';
import { Link } from 'remix';
import LinkedTableData from '../LinkedTableData';

type Sort = 'firstName' | 'lastName';

interface IProps {
  baseUrl: string;
  users: User[];
}

const UserTable: React.FC<IProps> = ({ baseUrl, users }) => {
  const [order, setOrder] = React.useState<Sort>('firstName');

  return (
    <table className="w-full table-auto border-2 border-blue-600">
      <thead className="text-left bg-red-300 border-b-2 border-gray-600 sticky top-0">
        <th onClick={() => setOrder('firstName')}>
          Voornaam
          {order === 'firstName' && <i className="fas fa-sort-down" />}
        </th>
        <th
          onClick={() => setOrder('lastName')}
          className="border-r border-gray-400 cursor-pointer"
        >
          Achternaam
        </th>
        <th>Email</th>
        {/* <th>Edit</th> */}
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
            <tr className="hover:bg-blue-200 cursor-pointer" key={user.id}>
              <LinkedTableData href={`${baseUrl}/${user.id}`}>
                {user.firstName}
              </LinkedTableData>
              <LinkedTableData
                href={`${baseUrl}/${user.id}`}
                className="px-1 border-r border-gray-400"
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

export default UserTable;
