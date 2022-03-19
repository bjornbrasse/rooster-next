import { getOrganisationEmployees, getUsers } from '~/controllers/user.server';
import {
  Link,
  LoaderFunction,
  Outlet,
  useFetcher,
  useLoaderData,
  useParams,
} from 'remix';
import { TypeOf } from 'zod';
import * as React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DnDItemTypes } from '~/utils/dnd';
import { getDepartmentEmployees } from '~/controllers/department';
import { ColumnLookupView } from '~/components/column-lookp-view';
import { BBLoader } from 'types';

type LoaderData = {
  departmentEmployees: Awaited<ReturnType<typeof getDepartmentEmployees>>;
  organisationEmployees: Awaited<ReturnType<typeof getOrganisationEmployees>>;
};

export const loader: BBLoader<{
  departmentId: string;
  organisationId: string;
}> = async ({ params }): Promise<LoaderData> => {
  const departmentEmployees = await getDepartmentEmployees({
    departmentId: params.departmentId,
  });

  const organisationEmployees = await getOrganisationEmployees({
    organisationId: params.organisationId,
  });

  return { departmentEmployees, organisationEmployees };
};

export default function DepartmentEmployees() {
  const [searchValue, setSearchValue] = React.useState('');
  const { departmentEmployees, organisationEmployees } =
    useLoaderData() as LoaderData;
  const fetcher = useFetcher();
  const { departmentId } = useParams();

  const listItem: React.FC<{
    employee: typeof organisationEmployees[number];
  }> = ({ employee }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: DnDItemTypes.ORGANISATIONEMPLOYEE,
      item: employee,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }));

    return (
      <div
        ref={drag}
        className={`${
          isDragging ? 'bg-yellow-300' : 'bg-sky-100'
        } select-none hover:bg-sky-800 hover:text-white cursor-pointer`}
        key={employee.id}
      >{`${employee.firstName} ${employee.lastName}`}</div>
    );
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: DnDItemTypes.ORGANISATIONEMPLOYEE,
    drop: (item: { id: string; departmentId: string }) => {
      console.log('laten vallen!', item);
      fetcher.submit(
        { userId: item.id, departmentId: departmentId as string },
        { method: 'post', action: '/_api/addUserToDepartment' }
      );
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // const searchedEmployees = React.useMemo(() => {
  //   return organisationEmployees
  //     .filter((v) => !departmentEmployees?.employees.find((e) => e.id === v.id))
  //     .filter(
  //       (v) =>
  //         v.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
  //         v.lastName.toLowerCase().includes(searchValue.toLowerCase())
  //     );
  // }, [searchValue]);

  return (
    <ColumnLookupView
      listItems={departmentEmployees.map(({ user }) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
      }))}
      listTitle="Medewerkers"
    >
      <Outlet />
    </ColumnLookupView>
  );
}
