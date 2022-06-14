import { json, redirect, useLoaderData } from 'remix';
import { BBLoader } from 'types';
import { Container } from '~/components/container';
import { db } from '~/utils/db.server';

async function getDepartment({
  departmentSlug,
  organisationSlug,
}: {
  departmentSlug: string;
  organisationSlug: string;
}) {
  return await db.department.findUnique({
    where: {
      organisationId_slug: {
        organisationId:
          (
            await db.organisation.findUnique({
              where: { slug: organisationSlug },
            })
          )?.id ?? '',
        slug: departmentSlug,
      },
    },
    include: { schedules: true },
  });
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
