import { Department } from '@prisma/client';
import { json, Link, useLoaderData, useMatches, useParams } from 'remix';
import { BBLoader } from 'types';
import { Container } from '~/components/container';
import DepartmentForm from '~/components/forms/department-form';
import { Frame } from '~/components/frame';
import { useDialog } from '~/contexts/dialog';
import { db } from '~/utils/db.server';
import { LoaderData as OrganisationLoaderData } from '../../$organisationSlug/index';

async function getDepartments({
  organisationSlug: slug,
}: {
  organisationSlug: string;
}) {
  return await db.department.findMany({ where: { organisation: { slug } } });
}

type LoaderData = {
  departments: Awaited<ReturnType<typeof getDepartments>>;
};

export const loader: BBLoader<{ organisationSlug: string }> = async ({
  params: { organisationSlug },
}) => {
  const departments = await getDepartments({ organisationSlug });

  return json<LoaderData>({ departments });
};

export default function OrganisationDepartments() {
  const { closeDialog, openDialog } = useDialog();
  const { departments } = useLoaderData() as LoaderData;
  const { organisationSlug } = useParams();

  const data = useMatches().find((m) => m.pathname === `/${organisationSlug}`)
    ?.data as OrganisationLoaderData;
  const organisation = data?.organisation;

  return (
    <Container>
      <Frame
        buttons={
          <button
            className="inline-block"
            onClick={() =>
              openDialog(
                'Nieuwe Afdeling',
                <DepartmentForm
                  organisationId={organisation.id}
                  onSaved={(department: Department) => {
                    closeDialog();
                  }}
                />,
              )
            }
          >
            <i className="fas fa-plus"></i>
          </button>
        }
        title="Afdelingen"
      >
        {departments.map((department) => (
          <Link
            to={`/${organisationSlug}/${department.slug}/employees`}
            key={department.id}
          >
            {department.name}
          </Link>
        ))}
      </Frame>
    </Container>
  );
}
