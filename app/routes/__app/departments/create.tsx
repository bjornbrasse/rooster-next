import { ActionFunction, Form, json, redirect } from 'remix';
import { inferSafeParseErrors } from 'types';
import { z } from 'zod';
import { Field } from '~/components/form-elements';
import { requireUserId } from '~/controllers/auth.server';
import { createDepartment } from '~/controllers/department.server';
import { badRequest } from '~/utils/helpers';

const schema = z.object({
  name: z.string(),
  slug: z.string(),
});

type ActionData = {
  fields?: z.input<typeof schema>;
  errors?: inferSafeParseErrors<typeof schema>;
  department?: Awaited<ReturnType<typeof createDepartment>>;
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  const { organisationId } = params;
  if (!organisationId) return redirect('/organisations');

  const result = schema.safeParse(Object.fromEntries(await request.formData()));
  if (!result.success) {
    return badRequest({ error: result.error.flatten() });
  }

  const department = await createDepartment({
    ...result.data,
    organisationId,
    createdById: userId,
  });

  if (!department)
    return badRequest<ActionData>({
      errors: { formErrors: ['Something went wrong.'] },
    });

  return redirect(`./${department.id}/tasks`);
};

export default function DepartmentCreate() {
  return (
    <div className="flex flex-col items-center">
      <h1>Nieuwe afdeling</h1>
      <Form
        method="post"
        className="min-w-full max-w-lg border border-gray-400 p-4"
      >
        <Field name="name" label="Afdeling" />
        <Field name="slug" label="Slug" />
        <button type="submit" className="btn btn-save">
          Opslaan
        </button>
      </Form>
    </div>
  );
}
