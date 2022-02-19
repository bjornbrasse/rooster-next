import { Department } from '@prisma/client';
import { useMatches, useParams } from 'remix';
import Container from '~/components/Container';

export default function Department() {
  const { departmentSlug, organisationSlug } = useParams();

  const data = useMatches().find(
    (m) => m.pathname === `/${organisationSlug}/${departmentSlug}`
  )?.data as { department: Department };

  const department = data?.department;

  return (
    <Container padding={true}>
      <h1>{department.name}</h1>
    </Container>
  );
}
