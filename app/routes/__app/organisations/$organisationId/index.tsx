import { Department, User } from '@prisma/client';
import { json, Link, redirect, useLoaderData, useParams } from 'remix';
import { BBLoader } from 'types';
import { Container } from '~/components/container';
import DepartmentForm from '~/components/forms/department-form';
import { UserForm } from '~/components/forms/user-form';
import { Frame } from '~/components/frame';
import { useDialog } from '~/contexts/dialog';
import { getOrganisation } from '~/controllers/organisation';

type LoaderData = {
  organisation: Exclude<Awaited<ReturnType<typeof getOrganisation>>, null>;
};

export const loader: BBLoader<{ organisationId: string }> = async ({
  params,
}) => {
  const organisation = await getOrganisation({ id: params.organisationId });

  if (!organisation) return redirect('/organisations');

  return json<LoaderData>({ organisation });
};

export default function Organisation() {
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
          {organisation.employees.map((employee) => (
            <Link to={`./employees/${employee.id}`} key={employee.id}>
              {employee.firstName}
            </Link>
          ))}
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
