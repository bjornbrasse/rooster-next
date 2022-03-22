type validateFn = (
  value: string | null,
) => string | null | Promise<string | null>;

export const validateString: validateFn = (string: string | null) => {
  if (!string) return `String is required`;
  if (string.length > 60) return `String is too long`;
  return null;
};

export const validateEmail: validateFn = (email: string | null) => {
  if (!email) return `Email is required`;
  if (!/^.+@.+\..+$/.test(email)) return `That's not an email`;

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
