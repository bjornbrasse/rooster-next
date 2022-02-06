import { redirect } from 'remix';
import { getUser, requireUser } from './auth.server';

export async function userIsAdmin(request: Request, redirectTo: string = '/') {
  const user = await requireUser(request, { redirectTo });

  console.log('rol', user.role);

  if (user.role !== 'ADMIN') return redirect(redirectTo);
}

export async function can(
  access: 'viewOrganisations',
  request: Request,
  options: { redirectTo: string } = { redirectTo: '/' }
): Promise<Boolean> {
  const user = await getUser(request);

  if (!user) throw redirect(options?.redirectTo ?? '/');

  // return Boolean(user[`can${access[0].toUpperCase()}${access.slice(1)}`]);
  return user.canViewOrganisations;
}
