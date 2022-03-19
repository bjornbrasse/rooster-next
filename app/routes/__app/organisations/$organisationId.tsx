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
import { BBHandle } from 'types';

export const handle: BBHandle = {
  id: 'organisationRoute',
};

type LoaderData = {
  organisation: Organisation;
};

export const loader: BBLoader<{ organisationId: string }> = async ({
  params,
}): Promise<LoaderData | Response> => {
  const organisation = await getOrganisation({
    where: { id: params.organisationId },
  });

  if (!organisation) return redirect('/organisations');

  return { organisation };
};

export default function OrganisationAdmin() {
  const { organisation } = useLoaderData<LoaderData>();
  const { organisationId } = useParams();

  return (
    <div className="w-full h-full flex flex-col">
      <Navigator organisation={organisation} />
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
