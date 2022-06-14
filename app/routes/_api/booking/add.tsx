import { ActionFunction, json } from 'remix';
import { inferSafeParseErrors } from 'types';
import { z } from 'zod';
import { requireUserId } from '~/controllers/auth.server';
import { badRequest } from '~/utils/helpers';

const baseSchema = z.object({
  taskId: z.string(),
  userId: z.string(),
  date: z.date(),
});

const schema = z.preprocess((arg) => {
  const obj = Object(arg);

  obj.date = new Date(obj.date);

  return obj;
}, baseSchema);

type ActionData = {
  fields?: z.infer<typeof schema>;
  errors?: inferSafeParseErrors<typeof schema>;
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const result = schema.safeParse({
    ...Object.fromEntries(await request.formData()),
    userId,
  });

  if (!result.success)
    return badRequest<ActionData>({
      errors: result.error.flatten(),
    });

  console.log('gelukt', result.data);

  return json<ActionData>({ fields: result.data });
};
