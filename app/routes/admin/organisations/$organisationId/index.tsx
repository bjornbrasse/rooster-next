import { ActionFunction, LoaderFunction, useLoaderData } from 'remix';
import { redirect } from 'remix';
import { db } from '~/utils/db.server';
import { badRequest } from '~/utils/helpers';
import { validateText } from '~/utils/validation';

type LoaderData = {
  organisation: Organisation | null;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const organisation = await db.organisation.findUnique({
    where: { id: params.organisationId as string },
  });

  return { organisation };
};

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
  const slugName = form.get('slugName');

  if (
    typeof name !== 'string' ||
    typeof nameShort !== 'string' ||
    typeof slugName !== 'string'
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
    data: { name, nameShort, slugName },
  });

  if (!organisation)
    return badRequest<ActionData>({ formError: 'Something went wrong.' });

  return redirect(`/organisations`);
};

export default function Organisation() {
  const { organisation } = useLoaderData<LoaderData>();

  return (
    <div className="container">
      <h1>Bewerk organisatie</h1>
      <form method="POST" className="grid grid-cols-2 gap-y-4">
        <label htmlFor="name">Naam</label>
        <input
          type="text"
          name="name"
          id="name"
          defaultValue={organisation.name}
        />
        <label htmlFor="nameShort">Verkorte naam</label>
        <input
          type="text"
          name="nameShort"
          id="nameShort"
          defaultValue={organisation.nameShort}
        />
        <label htmlFor="slugName">Adres naam</label>
        <input
          type="text"
          name="slugName"
          id="slugName"
          defaultValue={organisation.slugName}
          disabled={true}
        />
        <button type="submit" className="btn btn-save">
          Opslaan
        </button>
      </form>
    </div>
  );
}
