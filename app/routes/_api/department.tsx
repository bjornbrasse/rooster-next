import { ActionFunction, json } from 'remix';
import { badRequest } from '~/utils/helpers';
import { createDepartment } from '~/controllers/department.server';
import { z } from 'zod';
import { inferSafeParseErrors } from 'types';
import { requireUserId } from '~/controllers/auth.server';

const schema = z.object({
  name: z.string(),
  nameShort: z.string().optional(),
  slug: z.string(),
  organisationId: z.string().cuid(),
});

export type ActionData =
  | {
      success: false;
      fields?: z.input<typeof schema>;
      errors?: inferSafeParseErrors<typeof schema>;
    }
  | { success: true; department: Awaited<ReturnType<typeof createDepartment>> };

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const result = schema.safeParse(Object.fromEntries(await request.formData()));
  if (!result.success) {
    return badRequest({ error: result.error.flatten() });
  }

  const department = await createDepartment({
    ...result.data,
    createdById: userId,
  });

  if (!department)
    return badRequest<ActionData>({
      success: false,
      errors: { formErrors: ['Department not created'] },
    });

  return json<ActionData>({ success: true, department });
};

export default () => null;
