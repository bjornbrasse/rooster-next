import { Outlet, useParams } from 'remix';
import { Tabs } from '~/components/tabs';

export default function OrganisationLayout() {
  const { departmentSlug, organisationSlug } = useParams();

  return (
    <div className="flex h-full">
      <div id="menu">
        <Tabs>
          <Tabs.Tab
            href={`/${organisationSlug}/${departmentSlug}/`}
            icon="fas fa-building"
          />
          <Tabs.Tab href={`employees`} icon="fas fa-user" />
          <Tabs.Tab href={`tasks`} icon="fas fa-flag" />
          <Tabs.Tab href={`schedules`} icon="fas fa-calendar-alt" />
        </Tabs>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
