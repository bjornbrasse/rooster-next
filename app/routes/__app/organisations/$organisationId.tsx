import { json, Link, Outlet, redirect, useLoaderData } from 'remix';
import { BBLoader } from 'types';
import { Container } from '~/components/container';
import { Header } from '~/components/header';
import organisation from '~/routes/_api/organisation';
import { db } from '~/utils/db.server';

const getOrganisation = async (id: string) => {
  return await db.organisation.findUnique({
    where: { id },
  });
};
type LoaderData = {
  organisation: Exclude<Awaited<ReturnType<typeof getOrganisation>>, null>;
};

export const loader: BBLoader<{ organisationId: string }> = async ({
  params,
}) => {
  const organisation = await getOrganisation(params.organisationId);

  if (!organisation) return redirect('/organisations');

  return json<LoaderData>({ organisation });
};

export default function OrganisationLayout() {
  const { organisation } = useLoaderData() as LoaderData;

  return (
    <Container>
      <Header>
        <Link to="/organisations" className="mr-1 flex space-x-2">
          <i className="fas fa-angle-left"></i>
          <i className="fas fa-building"></i>
        </Link>
        <p>{organisation.name}</p>
      </Header>
      <div id="content" className="flex flex-col space-y-8 px-24">
        <Outlet />
      </div>
    </Container>
  );
}
