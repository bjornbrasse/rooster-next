import { db } from './db.server';

type validateFn = (
  value: string | null,
) => string | null | Promise<string | null>;

type LengthObject = { length: number; errorMessage?: string };

function isLengthObject(item: number | LengthObject): item is LengthObject {
  return !!(item as LengthObject).length;
}

export const validateString =
  (options?: {
    min?: number | { length: number; errorMessage?: string };
    max?: number | { length: number; errorMessage?: string };
  }): validateFn =>
  (value: string | null) => {
    if (!value) return `String is required`;
    if (!options) return null;

    const { min, max } = options;

    if (min) {
      if (
        value.length < min ||
        (isLengthObject(min) && value.length < min.length)
      )
        return (isLengthObject(min) && min.errorMessage) || 'te klein';
    }

    if (max) {
      if (
        value.length > max ||
        (isLengthObject(max) && value.length > max.length)
      )
        return (isLengthObject(max) && max.errorMessage) || 'te lang';
    }

    return null;
  };

export const validateEmail: validateFn = async (email: string | null) => {
  if (!email) return `Email is required`;
  if (!/^.+@.+\..+$/.test(email)) return `That's not an email`;

  // Does already exist in db?
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) return 'Email al in gebruik!';

  // try {
  //   const verifierResult = await verifyEmailAddress(email)
  //   if (!verifierResult.status) {
  //     return `I tried to verify that email address and got this error message: "${verifierResult.error.message}". If you think this is wrong, shoot an email to team@kentcdodds.com.`
  //   }
  // } catch (error: unknown) {
  //   console.error(`There was an error verifying an email address:`, error)
  //   // continue on... This was probably our fault...
  //   // IDEA: notify me of this issue...
  // }

  return null;
};
