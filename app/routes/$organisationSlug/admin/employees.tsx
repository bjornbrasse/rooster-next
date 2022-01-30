import { Organisation, User } from '@prisma/client';
import { Link, LoaderFunction, Outlet, redirect, useLoaderData } from 'remix';
import Tab from '~/components/Tab';
import { db } from '~/utils/db.server';

type LoaderData = {
  employees: User[];
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const organisation = await db.organisation.findUnique({
    where: { slugName: params.organisationSlug as string },
  });
  const employees = await db.user.findMany({
    where: { organisationId: organisation?.id },
  });

  return { employees };
};

export default function Organisation() {
  const { employees } = useLoaderData<LoaderData>();

  return (
    <div className="h-full border border-red-500">
      <h3>Medewerkers</h3>
      {employees.map((employee) => (
        <h2>{employee.firstName}</h2>
      ))}
    </div>
  );
}
