import { Organisation, User } from '@prisma/client';
import { useLoaderData, useMatches, useParams } from 'remix';
import { BBLoader } from 'types';
import { Container } from '~/components/container';
import { UserForm } from '~/components/forms/user-form';
import { Frame } from '~/components/frame';
import { UserTable } from '~/components/tables/user-table';
import { useDialog } from '~/contexts/dialog';
import { db } from '~/utils/db.server';
import { LoaderData as OrganisationLoaderData } from '../../$organisationSlug/index';

const getEmployees = async ({
  organisationSlug,
}: {
  organisationSlug: string;
}) => {
  return await db.user.findMany({
    where: { organisation: { slug: organisationSlug } },
  });
};

type LoaderData = {
  employees: Awaited<ReturnType<typeof getEmployees>>;
};

export const loader: BBLoader<{ organisationSlug: string }> = async ({
  params: { organisationSlug },
}) => {
  const employees = await getEmployees({ organisationSlug });

  return { employees };
};

export default function OrganisationEmployees() {
  const { closeDialog, openDialog } = useDialog();
  const { employees } = useLoaderData() as LoaderData;
  const { organisationSlug } = useParams();

  const data = useMatches().find(
    (m) => m.pathname === `/${organisationSlug}/index`,
  )?.data as OrganisationLoaderData;
  const organisation = data?.organisation;

  return (
    <Container>
      {organisation && <h1>{organisation.name}</h1>}
      <Frame
        buttons={
          <button
            onClick={() =>
              openDialog(
                'Nieuwe medewerker',
                <UserForm
                  onSaved={(user: User) => {
                    closeDialog();
                  }}
                  organisationId={data.organisation.id}
                />,
              )
            }
          >
            <i className="fas fa-plus"></i>
          </button>
        }
        title="Medewerkers"
      >
        <UserTable baseUrl={''} users={employees} />
      </Frame>
    </Container>
  );
}
