import type { LoaderFunction } from 'remix';
import { redirect } from 'remix';
import { Outlet } from 'remix';
import { userIsAdmin } from '~/controllers/access.server';

export const loader: LoaderFunction = async ({ request }) => {
  if (await userIsAdmin(request, '/login')) return redirect('/auth/login');

  return null;
};

export default function AdminLayout() {
  return <Outlet />;
}
