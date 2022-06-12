import {Outlet, useParams } from 'remix';
import { Tabs } from '~/components/tabs';

export default function OrganisationLayout() {
  const { organisationSlug } = useParams();
  const { departmentSlug } = useParams();

  return (
    <div className="flex h-full">
      {!departmentSlug && (
        <div id="menu">
          <Tabs>
            <Tabs.Tab href={`/${organisationSlug}/`} icon="fas fa-building" />
            <Tabs.Tab
              href={`/${organisationSlug}/employees`}
              icon="fas fa-user"
            />
            <Tabs.Tab
              href={`/${organisationSlug}/departments`}
              icon="fas fa-users"
            />
          </Tabs>
        </div>
      )}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
