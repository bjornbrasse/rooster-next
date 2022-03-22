import { Organisation } from '@prisma/client';
import {
  ActionFunction,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useParams,
} from 'remix';
// import { ActionData, createUser } from '~/user';
import { db } from '~/utils/db.server';
import { badRequest } from '~/utils/helpers';
import { validateText } from '~/utils/validation';

type ActionData = {
  formError?: string;
  fields?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  fieldErrors?: {
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  const firstName = form.get('firstName');
  const lastName = form.get('lastName');
  const email = form.get('email');

  if (
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof email !== 'string'
  ) {
    return badRequest({
      FormError: `Form not submitted correctly.`,
    });
  }
  const fields = { firstName, lastName, email };

  const fieldErrors = {
    firstName: validateText(firstName, {
      min: { length: 2, errorMessage: 'MOORE than 2' },
    }),
    lastName: validateText(lastName, {
      max: { length: 4, errorMessage: 'MAX 4' },
    }),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  const organisation = await db.organisation.findUnique({
    where: { slug: params.organisationSlug as string },
  });

  if (!organisation) {
    return badRequest({ formError: 'Organisation not found' });
  }

  const user = await db.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash: '123',
      organisationId: organisation.id,
    },
  });

  if (!user)
    return badRequest<ActionData>({ formError: 'Something went wrong.' });

  return redirect(`/${organisation.slug}/admin/employees`);
};

type LoaderData = {
  organisations: Organisation[];
};

export default function OrganisationEmployeesCreate() {
  const data = useActionData<ActionData>();
  const fieldErrors = data?.fieldErrors;

  return (
    <div className="h-full p-24">
      <h1>Create User</h1>
      <form method="POST" className="xl:w-2/3">
        <fieldset className="grid grid-cols-2 gap-y-4">
          <label htmlFor="firstName">Voornaam</label>
          <input type="text" name="firstName" id="firstName" autoFocus />
          {fieldErrors?.firstName && <p>Fout - {fieldErrors.firstName}</p>}
          <label htmlFor="lastName">Achternaam</label>
          <input type="text" name="lastName" id="lastName" />
          <label htmlFor="email">Email</label>
          <input type="text" name="email" id="email" />
        </fieldset>
        <button type="submit" className="btn btn-save">
          Opslaan
        </button>
      </form>
    </div>
  );
}
