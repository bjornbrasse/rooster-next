import { User } from "@prisma/client";
import * as React from "react";
import { LoaderFunction, useLoaderData } from "remix";
import Container from "~/components/Container";
import { getOrganisationEmployees, getUsers } from "~/controllers/user.server";

type LoaderData = {
  employees: User[];
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const { organisationId } = params;

  const employees = await getUsers({ organisationId: String(organisationId) });

  return { employees };
};

export default function Employees() {
  const { employees } = useLoaderData<LoaderData>();

  return (
    <Container>
      {employees.map((employee) => (
        <div>{employee.firstName}</div>
      ))}
    </Container>
  );
}
