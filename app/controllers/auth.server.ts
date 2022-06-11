import { createCookieSessionStorage, json, redirect } from 'remix';
import { DepartmentEmployee, Organisation, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { customRandom, random, urlAlphabet } from 'nanoid';
import { db } from '../utils/db.server';
import { sendEmail } from '~/utils/email';
import { passwordResetEmail } from '~/utils/email/templates';
import { badRequest } from '~/utils/helpers';
import { UserSecure } from 'types';

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set');
}

const sessionIdKey = '__session_id__';

const storage = createCookieSessionStorage({
  cookie: {
    name: 'Rooster_root_session',
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

export async function useSession(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'));
  const initialValue = await storage.commitSession(session);

  const getSessionId = () => session.get(sessionIdKey) as string | undefined;

  const unsetSessionId = () => session.unset(sessionIdKey);

  const commit = async () => {
    const currentValue = await sessionStorage.commitSession(session);
    return currentValue === initialValue ? null : currentValue;
  };

  return {
    session,
    // getUser: async () => {
    //   const token = getSessionId()
    //   if (!token) return null

    //   return getUserFromSessionId(token).catch((error: unknown) => {
    //     unsetSessionId()
    //     console.error(`Failure getting user from session ID:`, error)
    //     return null
    //   })
    // },
    getSessionId,
    unsetSessionId,
    // signIn: async (user: Pick<User, 'id'>) => {
    //   const userSession = await createSession({userId: user.id})
    //   session.set(sessionIdKey, userSession.id)
    // },
    // signOut: () => {
    //   const sessionId = getSessionId()
    //   if (sessionId) {
    //     unsetSessionId()
    //     prismaWrite.session
    //       .delete({where: {id: sessionId}})
    //       .catch((error: unknown) => {
    //         console.error(`Failure deleting user session: `, error)
    //       })
    //   }
    // },
    commit,
    /**
     * This will initialize a Headers object if one is not provided.
     * It will set the 'Set-Cookie' header value on that headers object.
     * It will then return that Headers object.
     */
    getHeaders: async (headers: ResponseInit['headers'] = new Headers()) => {
      const value = await commit();
      if (!value) return headers;
      if (headers instanceof Headers) {
        headers.append('Set-Cookie', value);
      } else if (Array.isArray(headers)) {
        headers.push(['Set-Cookie', value]);
      } else {
        headers['Set-Cookie'] = value;
      }
      return headers;
    },
  };
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

export async function setPasswordResetToken(
  args: { email: string; userId?: never } | { email?: never; userId: string },
): Promise<
  { success: true; user: Omit<User, 'passwordHash'> } | { success: false }
> {
  const passwordResetToken = customRandom(urlAlphabet, 48, random)();

  const user = await db.user.update({
    where: { email: args?.email, id: args?.userId },
    data: { passwordResetToken },
  });

  if (!user) return { success: false };

  return { success: true, user };
}

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');

  return userId && typeof userId === 'string' ? userId : null;
}

export async function getUser(request: Request): Promise<UserSecure | null> {
  const userId = await getUserId(request);

  const user = await db.user.findUnique({
    where: { id: userId ?? '' },
    include: {
      organisation: true,
    },
  });

  if (!user) return null;

  const {
    emailValidationToken,
    passwordHash,
    passwordResetToken,
    ...userSecure
  } = user;

  return userSecure;
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await db.user.findUnique({
    where: { email },
    include: { organisation: true },
  });

  if (!user) return null;

  const { passwordHash, ...userSecure } = user;

  const isCorrectPassword = await bcrypt.compare(password, passwordHash ?? '');
  if (!isCorrectPassword) return null;

  return userSecure;
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'));
  return redirect('/auth/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}

// export async function register({
//   firstName,
//   lastName,
//   initials,
//   email,
//   password,
// }: {
//   firstName: string;
//   lastName: string;
//   initials: string;
//   email: string;
//   password: string;
// }) {
//   const passwordHash = await bcrypt.hash(password, 10);
//   const emailValidationToken = nanoid(24);

//   // TODO: replace with real entry organisation
//   const organisationSlug = email.split('@').pop()?.split('.')[0];

//   return db.user.create();
// }

export async function requireUserId(
  request: Request,
  options: { redirectTo?: string } = { redirectTo: '/' },
): Promise<string> {
  const userId = await getUserId(request);

  if (!userId) throw redirect(options.redirectTo!);

  return userId;
}

export async function requireUser(
  request: Request,
  options: { isAdmin?: boolean; redirectTo?: string } = {
    redirectTo: '/auth/login',
  },
): Promise<UserSecure> {
  const user = await getUser(request);

  if (!user) throw redirect(`/auth/login?redirectTo=${options.redirectTo}`);

  if (options.isAdmin) {
    if (user.role !== 'ADMIN') throw redirect(options.redirectTo!);
  }

  return user;
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
