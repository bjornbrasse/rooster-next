import { ActionFunction, redirect } from 'remix';
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

export const action: ActionFunction = async ({ request }) => {
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

  const organisation = await db.organisation.create({
    data: { name, nameShort, slug, emailDomain: '@test.nl' },
  });

  if (!organisation)
    return badRequest<ActionData>({ formError: 'Something went wrong.' });

  return redirect(`/${organisation.slug}/admin/employees`);
};

export default function OrganisationCreate() {
  return (
    <div className="container">
      <h1>Maak een organisatie aan</h1>
      <form method="POST" className="grid grid-cols-2 gap-y-4">
        <label htmlFor="name">Naam</label>
        <input type="text" name="name" id="name" autoFocus />
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
