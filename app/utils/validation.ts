export const validateText = (
  text: string,
  options: {
    min?: number | { length?: number; errorMessage?: string };
    max?: number | { length?: number; errorMessage?: string };
  }
): string[] | undefined => {
  const errors: string[] = [];

  if (options?.max && text.length < options?.max)
    errors.push(`Maximum ${options.max} characters`);

  if (options?.min && text.length < options.min) {
    // if ('min.errorMessage' in options) {
    //   console.log('wel gevonden', options.min.errorMessage);
    //   errors.push(
    //     options.min.errorMessage ||
    //       `Must be longer than ${options.min} characters`
    //   );
    // }
    errors.push(`Must be longer than ${options.min} characters`);
  }

  if (errors.length > 0) return errors;
};
