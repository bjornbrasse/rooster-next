import { Department } from '@prisma/client';
import { LoaderFunction, redirect } from 'remix';
import { useMatches, useParams } from 'remix';
import { getDepartment } from '~/controllers/department';

type LoaderData = {
  department: Department;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData | Response> => {
  const department = await getDepartment({
    departmentId: String(params.departmentId),
  });

  if (!department) return redirect('/');

  return { department };
};

export default function Department() {
  const { departmentId } = useParams();
  // const parentData = useMatches().find(
  //   (m) => m.pathname === `/${organisationSlug}/admin/departments`
  // )?.data as {
  //   departments: Array<Department>;
  // };

  return (
    <div>
      <h3>Afdeling </h3>
      <h2></h2>
    </div>
  );
}
