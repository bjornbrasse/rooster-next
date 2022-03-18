import { getOrganisationEmployees, getUsers } from "~/controllers/user.server";
import { LoaderFunction, useFetcher, useLoaderData, useParams } from "remix";
import { TypeOf } from "zod";
import * as React from "react";
import { useDrag, useDrop } from "react-dnd";
import { DnDItemTypes } from "~/utils/dnd";

type LoaderData = {
  organisationEmployees: Awaited<ReturnType<typeof getOrganisationEmployees>>;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const organisationEmployees = await getOrganisationEmployees({
    organisationId: params.organisationId as string,
  });

  return { organisationEmployees };
};

export default function DepartmentEmployees() {
  const [searchValue, setSearchValue] = React.useState("");
  const { organisationEmployees } = useLoaderData() as LoaderData;
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
          isDragging ? "bg-yellow-300" : "bg-sky-100"
        } select-none hover:bg-sky-800 hover:text-white cursor-pointer`}
        key={employee.id}
      >{`${employee.firstName} ${employee.lastName}`}</div>
    );
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: DnDItemTypes.ORGANISATIONEMPLOYEE,
    drop: (item: { id: string; departmentId: string }) => {
      console.log("laten vallen!", item);
      fetcher.submit(
        { userId: item.id, departmentId: departmentId as string },
        { method: "post", action: "/_api/addUserToDepartment" }
      );
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const searchedEmployees = React.useMemo(() => {
    return organisationEmployees.filter(
      (v) =>
        v.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
        v.lastName.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

  return (
    <div className="h-full flex flex=-col">
      <div className="flex-grow border-2 border-green-300">
        <h1>Afdelings Medewerkers</h1>
        <div
          ref={drop}
          className={`h-24 w-96 border-2 border-gray-500 text-center ${
            isOver ? "bg-sky-300" : null
          }`}
        >
          drop
        </div>
      </div>
      <div className="w-1/4 border-4 border-red-300">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Zoeken..."
          onChange={(e) => setSearchValue(e.target.value)}
          className="mt-2 p-1 mx-auto text-md rounded-lg"
        />

        {searchedEmployees.map((employee) => listItem({ employee }))}
      </div>
    </div>
  );
}
