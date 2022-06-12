import { redirect } from 'remix';
import { getUserSecure, requireUser } from './auth.server';

// export async function userIsAdmin(
//   request: Request,
//   redirectTo: string = '/'
// ): Promise<Boolean> {
//   const user = await requireUser(request, { redirectTo });

//   return user.role !== 'ADMIN';
// }

export async function can(
  access: 'viewOrganisations',
  request: Request,
  options: { redirectTo: string } = { redirectTo: '/' },
): Promise<Boolean> {
  const user = await getUserSecure(request);

  if (!user) throw redirect(options?.redirectTo ?? '/');

  // return Boolean(user[`can${access[0].toUpperCase()}${access.slice(1)}`]);
  return user.canViewOrganisations;
}
