import { Outlet, useParams } from 'remix';
import { Tabs } from '~/components/tabs';

export default function OrganisationLayout() {
  const { departmentSlug, organisationSlug, scheduleSlug } = useParams();

  return (
    <div className="flex h-full w-full">
      {!scheduleSlug && (
        <Tabs>
          <Tabs.Tab
            href={`/${organisationSlug}/${departmentSlug}/`}
            icon="fas fa-building"
          />
          <Tabs.Tab href={`employees`} icon="fas fa-user" />
          <Tabs.Tab href={`tasks`} icon="fas fa-flag" />
          <Tabs.Tab href={`schedules`} icon="fas fa-calendar-alt" />
        </Tabs>
      )}
      <Outlet />
    </div>
  );
}
