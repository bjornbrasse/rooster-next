import { Organisation } from '@prisma/client';
import {
  Link,
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
  useParams,
} from 'remix';
import Tabs from '~/components/Tabs';
import { getOrganisation } from '~/controllers/organisation';
import Navigator from '~/components/Navigator';
import { BBLoader } from '~/types';
import { BBHandle, Breadcrumb } from 'types';

export const handle: BBHandle = {
  id: 'organisationRoute',
};

type LoaderData = {
  breadcrumb: Breadcrumb;
  organisation: Organisation;
};

export const loader: BBLoader<{ organisationId: string }> = async ({
  params,
}): Promise<LoaderData | Response> => {
  const organisation = await getOrganisation({
    where: { id: params.organisationId },
  });

  if (!organisation) return redirect('/organisations');

  const breadcrumb: Breadcrumb = {
    caption: organisation.name,
    to: organisation.id,
  };

  return { breadcrumb, organisation };
};

export default function OrganisationAdmin() {
  const { organisation } = useLoaderData<LoaderData>();
  const { organisationId } = useParams();

  return (
    <div className="flex h-full w-full flex-col">
      <Tabs>
        <Tabs.Tab to={`/organisations/${organisationId}/departments`}>
          Afdelingen
        </Tabs.Tab>
        <Tabs.Tab to={`/organisations/${organisationId}/employees`}>
          Medewerkers
        </Tabs.Tab>
      </Tabs>
      <div id="content" className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
