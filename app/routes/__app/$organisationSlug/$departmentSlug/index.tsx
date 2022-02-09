import { Department } from '@prisma/client';
import { useMatches, useParams } from 'remix';

export default function Department() {
  const { departmentSlug, organisationSlug } = useParams();

  const data = useMatches().find(
    (m) => m.pathname === `/${organisationSlug}/${departmentSlug}`
  )?.data as { department: Department };

  const department = data?.department;

  return (
    <div>
      <h1>{department.name}</h1>
    </div>
  );
}
