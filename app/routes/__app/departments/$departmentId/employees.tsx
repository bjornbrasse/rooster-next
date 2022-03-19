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

type LoaderData = {
  departmentEmployees: Awaited<ReturnType<typeof getDepartmentEmployees>>;
  organisationEmployees: Awaited<ReturnType<typeof getOrganisationEmployees>>;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const departmentEmployees = await getDepartmentEmployees({
    departmentId: params.departmentId as string,
  });
  const organisationEmployees = await getOrganisationEmployees({
    organisationId: params.organisationId as string,
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
      listTitle="Taken"
    >
      <Outlet />
    </ColumnLookupView>
    // <div className="h-full flex flex=-col">
    //   <div className="flex-grow border-4 border-green-300">
    //     <div className="h-full p-4 flex space-x-4 border-2 border-red-600">
    //       <div className="w-1/3 px-2 flex flex-col border-2 border-slate-300 rounded-lg overflow-hidden">
    //         <div
    //           ref={drop}
    //           className={`border-b-2 border-sky-700 ${
    //             isOver ? "bg-sky-300" : null
    //           }`}
    //         >
    //           drop
    //         </div>
    //         {departmentEmployees?.employees.map(
    //           ({ id, firstName, lastName }) => (
    //             <Link
    //               to={id}
    //               className="select-none"
    //               key={id}
    //             >{`${firstName} ${lastName}`}</Link>
    //           )
    //         )}
    //       </div>
    //       <div className="flex-grow shrink-0 border-2 border-sky-200">
    //         <Outlet />
    //       </div>
    //     </div>
    //   </div>
    //   <div className="w-1/4 border-4 border-red-300">
    //     <input
    //       type="text"
    //       name="search"
    //       id="search"
    //       placeholder="Zoeken..."
    //       onChange={(e) => setSearchValue(e.target.value)}
    //       className="mt-2 p-1 mx-auto text-md rounded-lg"
    //     />

    //     {searchedEmployees.map((employee) => listItem({ employee }))}
    //   </div>
    // </div>
  );
}
