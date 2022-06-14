import { Department, User } from '@prisma/client';
import { json, Link, redirect, useLoaderData, useParams } from 'remix';
import { BBHandle, BBLoader } from 'types';
import { Container } from '~/components/container';
import DepartmentForm from '~/components/forms/department-form';
import { UserForm } from '~/components/forms/user-form';
import { Frame } from '~/components/frame';
import { UserTable } from '~/components/tables/user-table';
import { useDialog } from '~/contexts/dialog';
import { getOrganisation } from '~/controllers/organisation';

export const handle: BBHandle = {
  id: 'OrganisationPage',
  breadcrumb: ({ data }: { data: LoaderData }) => ({
    caption: data?.organisation.name ?? 'Organisatie',
    href: `/${data?.organisation.slug ?? 'admin/organisaties'}/`,
  }),
};

export type LoaderData = {
  organisation: Exclude<Awaited<ReturnType<typeof getOrganisation>>, null>;
};

export const loader: BBLoader<{ organisationSlug: string }> = async ({
  params,
}) => {
  const organisation = await getOrganisation({ slug: params.organisationSlug });

  if (!organisation) return redirect('/organisations');

  return json<LoaderData>({ organisation });
};

export default function OrganisationPage() {
  const { organisation } = useLoaderData() as LoaderData;
  const { closeDialog, openDialog } = useDialog();
  const { employeeId } = useParams();

  return (
    <Container>
      <div id="content" className="flex flex-col space-y-8 lg:px-24">
        <Frame title="Algemeen">
          <h1>{organisation?.name}</h1>
        </Frame>

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
                    organisationId={organisation.id}
                  />,
                )
              }
            >
              <i className="fas fa-plus"></i>
            </button>
          }
          title="Medewerkers"
        >
          <UserTable baseUrl={''} users={organisation.employees} />
        </Frame>
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
          {organisation.departments.map((department) => (
            <Link to={`/departments/${department.id}`} key={department.id}>
              {department.name}
            </Link>
          ))}
        </Frame>
      </div>
    </Container>
  );
}
