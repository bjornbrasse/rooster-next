import { Department } from '@prisma/client';
import type { LoaderFunction } from 'remix';
import { useMatches, useParams } from 'remix';

export const loader: LoaderFunction = async ({ params }) => {
  return null;
};

export default function Departments() {
  const { organisationSlug, departmentId } = useParams();
  const parentData = useMatches().find(
    (m) => m.pathname === `/${organisationSlug}/admin/departments`
  )?.data as {
    departments: Array<Department>;
  };
  const department = parentData.departments.find((d) => d.id === departmentId);

  return (
    <div>
      <h3>Afdelingen</h3>
      <h2>{department?.name}</h2>
    </div>
  );
}
