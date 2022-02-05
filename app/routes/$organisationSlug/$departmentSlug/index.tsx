import { Department } from '@prisma/client';
import type { LoaderFunction } from 'remix';
import { useLoaderData } from 'remix';
import { getDepartment } from '~/models/department';

type LoaderData = {
  department: Department;
};

export const loader: LoaderFunction = async ({ params }) => {
  const department = await getDepartment({
    departmentSlug: String(params.departmentSlug),
  });

  return { department };
};

export default function Department() {
  const { department } = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>Afdeling 2 - {department.name}</h1>
    </div>
  );
}
