import { Department, User } from '@prisma/client';
import React from 'react';
import { json, Link, Outlet, redirect, useLoaderData, useParams } from 'remix';
import { BBLoader } from 'types';
import { Container } from '~/components/container';
import DepartmentForm from '~/components/forms/department-form';
import { UserForm } from '~/components/forms/user-form';
import { Frame } from '~/components/frame';
import { Header } from '~/components/header';
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
  const { openDialog } = useDialog();
  const { employeeId } = useParams();

  return (
    <Container>
      <Header>
        <Link to="/organisations">Organisations</Link>
        <i className="fas fa-angle-right"></i>
        <p>{organisation.name}</p>
      </Header>
      {employeeId ? (
        <Outlet />
      ) : (
        <div id="content" className="flex flex-col space-y-8 px-24">
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
                      onSaved={function (user: User): void {
                        throw new Error('Function not implemented.');
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
                      onSaved={function (department: Department): void {
                        throw new Error('Function not implemented.');
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
      )}
    </Container>
  );
}
