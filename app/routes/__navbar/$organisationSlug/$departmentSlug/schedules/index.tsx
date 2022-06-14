import { json, redirect, useLoaderData } from 'remix';
import { BBLoader } from 'types';
import { Container } from '~/components/container';
import { getDepartment } from '~/controllers/department.server';
import { db } from '~/utils/db.server';

async function getSchedules({ departmentId }: { departmentId: string }) {
  return await db.schedule.findMany({ where: { departmentId } });
}

type LoaderData = {
  department: Exclude<Awaited<ReturnType<typeof getDepartment>>, null>;
};

export const loader: BBLoader<{
  departmentSlug: string;
  organisationSlug: string;
}> = async ({ params: { departmentSlug, organisationSlug } }) => {
  const department = await getDepartment({
    departmentSlug,
    organisationSlug,
  });

  if (!department) return redirect('/home');

  return json<LoaderData>({ department });
};

export default function DepartmentSchedules() {
  const { department } = useLoaderData() as LoaderData;

  return (
    <Container>
      <h1>{`Roosters van ${department.name}`}</h1>
    </Container>
  );
}
