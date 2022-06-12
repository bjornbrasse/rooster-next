import {
  json,
  Link,
  Outlet,
  redirect,
  useLoaderData,
  useMatches,
  useParams,
} from 'remix';
import { BBLoader, User } from 'types';
import { Container } from '~/components/container';
import { Header } from '~/components/header';
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

export default function OrganisationLayout() {
  const { organisation } = useLoaderData() as LoaderData;
  const { organisationId, employeeId } = useParams();

  const data = useMatches().find(
    (m) =>
      m.pathname === `/organisations/${organisationId}/employees/${employeeId}`,
  )?.data as { employee: User };

  return (
    <Container>
      <Header>
        <Link to="/organisations" className="mr-1 flex space-x-2">
          <i className="fas fa-building"></i>
        </Link>
        <i className="fas fa-angle-right"></i>
        <Link to={`/organisations/${organisationId}`}>
          <p>{organisation.name}</p>
        </Link>
        {data?.employee && (
          <>
            <i className="fas fa-angle-right"></i>
            <p>{`${data.employee.firstName} ${data.employee.lastName}`}</p>
          </>
        )}
      </Header>
      <div id="content" className="flex flex-col space-y-8 px-24">
        <Outlet />
      </div>
    </Container>
  );
}
