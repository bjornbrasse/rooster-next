import { Outlet } from 'remix';
import { Tabs } from '~/components/tabs';

export default function AdminLayout() {
  return (
    <div className="flex h-full">
      <Tabs>
        <Tabs.Tab href={`/admin/organisations`} icon="fas fa-building" />
        <Tabs.Tab href={`/admin/users`} icon="fas fa-user" />
      </Tabs>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
