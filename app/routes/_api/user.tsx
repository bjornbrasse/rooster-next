import { User } from '@prisma/client';
import { ActionFunction, json } from 'remix';
import { inferSafeParseErrors } from 'types';
import { z } from 'zod';
import { requireUserId } from '~/controllers/auth.server';
import { createUser } from '~/controllers/user.server';
import { badRequest } from '~/utils/helpers';

const schema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  initials: z.string().optional(),
  organisationId: z.string().cuid(),
});

export type ActionData =
  | {
      fields?: z.input<typeof schema>;
      errors?: inferSafeParseErrors<typeof schema>;
    }
  | { user: User };

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const result = schema.safeParse(Object.fromEntries(await request.formData()));

  if (!result.success)
    return badRequest<ActionData>({ errors: result.error.flatten() });

  const user = await createUser({
    data: result.data,
  });

  if (!user)
    return badRequest<ActionData>({
      errors: { formErrors: ['User was no created'] },
      fields: result.data,
    });

  return json<ActionData>({ user });
};

export default () => null;
