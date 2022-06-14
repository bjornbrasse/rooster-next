import { json, redirect, useLoaderData, useParams } from 'remix';
import { BBLoader } from 'types';
import { Container } from '~/components/container';
import LinkedTableData from '~/components/LinkedTableData';
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
  const { departmentSlug, organisationSlug } = useParams();

  return (
    <Container>
      <h1>{`Roosters van ${department.name}`}</h1>
      <table className="border border-sky-300">
        <thead>
          <tr>
            <td>Naam</td>
          </tr>
        </thead>
        <tbody>
          {department.schedules.map((schedule) => (
            <tr key={schedule.id}>
              <LinkedTableData
                href={`/${organisationSlug}/${departmentSlug}/${schedule.slug}`}
              >
                <td>{schedule.name}</td>
              </LinkedTableData>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}
