import { Organisation, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { customRandom, nanoid, random, urlAlphabet } from 'nanoid';
import { createCookieSessionStorage, redirect } from 'remix';
import { db } from '../utils/db.server';

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'rooster_session',
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await db.user.findUnique({
    where: { email },
    include: { organisation: true, departments: true },
  });
  if (!user) return null;

  const isCorrectPassword = await bcrypt.compare(
    password,
    user.passwordHash ?? ''
  );
  if (!isCorrectPassword) return null;

  return user;
}

export async function getUserPasswordReset({ email }: { email: string }) {
  const passwordResetToken = customRandom(urlAlphabet, 48, random)();

  const user = await db.user.update({
    where: { email },
    data: { passwordResetToken },
    select: { firstName: true, email: true, passwordResetToken: true },
  });

  return user;
}

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/auth/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(
  request: Request,
  options?: {
    redirect?: {
      onSuccess?:
        | string
        | ((user: User & { organisation: Organisation }) => string);
      onFailure?: string;
    };
  }
) {
  const userId = await getUserId(request);
  if (typeof userId !== 'string') {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        organisation: true,
        departments: true,
      },
    });

    // if (user) {
    // if (options?.redirect?.onSuccess) {
    //   if (typeof options.redirect.onSuccess === 'string')
    //     throw redirect(options.redirect.onSuccess);
    //   throw redirect(options.redirect.onSuccess(user));
    // }
    // }
    return user;

    // if (options?.redirect?.onFailure)
    //   throw redirect(options.redirect.onFailure);

    // return null;
  } catch {
    console.log('komt bij logout?');
    throw logout(request);
  }
}

interface RequireOptions {
  redirectTo?: string;
}

interface RequireUserOptions {
  redirectTo?: string;
  isAdmin?: boolean;
}

export async function requireUser(
  request: Request,
  options: RequireUserOptions = { redirectTo: '/', isAdmin: false }
): Promise<User> {
  const user = await getUser(request);

  if (!user) throw redirect(options?.redirectTo ?? '/');

  if (options.isAdmin) {
    if (user.email !== 'b.brasse@etz.nl') throw new Error('Not admin');
  }

  return user;
}

interface RequireOrganisationOptions extends RequireOptions {
  userOptions?: { isEmloyee?: User | null };
}

// export async function requireOrganisation(
//   organisation: {
//     id?: string;
//     slug?: string;
//     include?: Prisma.OrganisationInclude;
//   },
//   options?: RequireOrganisationOptions
// ): Promise<Organisation> {
//   let org: (Organisation & { departments: Department[] }) | null = null;

//   if (organisation.id) {
//     org = await db.organisation.findUnique({
//       where: { id: organisation.id },
//       include: () =>
//         organisation.include?.departments ? { departments: true } : null,
//     });
//   } else if (organisation.slug) {
//     org = await db.organisation.findUnique({
//       where: { slug: organisation.slug },
//       include: organisation.include,
//     });
//   }

//   if (!org) throw redirect(options?.redirectTo ?? '/');

//   if (options?.userOptions?.isEmloyee) {
//     if (options.userOptions.isEmloyee.id !== org.id)
//       throw new Error('Not employee');
//   }

//   return org;
// }

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'));
  return redirect('/auth/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}

export async function createUserSession(user: User, redirectTo: string) {
  const session = await storage.getSession();
  session.set('userId', user.id);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}

export async function resetPassword({
  email,
  newPassword,
}: {
  email: string;
  newPassword: string;
}) {
  const passwordHash = await bcrypt.hash(newPassword, 10);

  const user = await db.user.update({
    where: { email },
    data: { passwordHash, passwordResetToken: '' },
  });
  if (!user) return null;

  return user;
}
