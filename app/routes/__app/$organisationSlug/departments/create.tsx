import type { ActionFunction } from 'remix';
import { redirect } from 'remix';
import { db } from '~/utils/db.server';
import { badRequest } from '~/utils/helpers';
import { validateText } from '~/utils/validation';

type ActionData = {
  formError?: string;
  fields?: {
    name: string;
  };
  fieldErrors?: {
    name: string | undefined;
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  const name = form.get('name');
  const nameShort = form.get('nameShort');
  const slug = form.get('slug');

  if (
    typeof name !== 'string' ||
    typeof nameShort !== 'string' ||
    typeof slug !== 'string'
  ) {
    return badRequest({ FormError: `Form not submitted correctly.` });
  }
  const fields = { name, nameShort };

  const fieldErrors = {
    title: validateText(name, {
      min: { length: 4, errorMessage: 'MOORE than 4' },
    }),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  const organisation = await db.organisation.findUnique({
    where: { slug: params.organisationSlug as string },
  });

  if (!organisation) {
    return badRequest({ formError: 'Something went wrong' });
  }

  const department = await db.department.create({
    data: { name, nameShort, slug, organisationId: organisation.id },
  });

  if (!department)
    return badRequest<ActionData>({ formError: 'Something went wrong.' });

  return redirect(`.`);
};

export default function OrganisationCreate() {
  return (
    <div className="container">
      <h1>Nieuwe afdeling</h1>
      <form method="POST" className="grid grid-cols-2 gap-y-4">
        <label htmlFor="name">Naam</label>
        <input type="text" name="name" id="name" />
        <label htmlFor="nameShort">Verkorte naam</label>
        <input type="text" name="nameShort" id="nameShort" />
        <label htmlFor="slug">Adres naam</label>
        <input type="text" name="slug" id="slug" />
        <button type="submit" className="btn btn-save">
          Opslaan
        </button>
      </form>
    </div>
  );
}