import { Organisation } from '@prisma/client';
// import {
//   Combobox,
//   ComboboxInput,
//   ComboboxPopover,
//   ComboboxList,
//   ComboboxOption,
// } from '@reach/combobox';
import {
  ActionFunction,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
} from 'remix';
import { ActionData, createUser } from '~/user';
import { db } from '~/utils/db.server';
import { badRequest } from '~/utils/helpers';
import { validateText } from '~/utils/validation';

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const firstName = form.get('firstName');
  const lastName = form.get('lastName');
  const email = form.get('email');
  const password = form.get('password');
  const passwordConfirm = form.get('passwordConfirm');
  const organisationId = form.get('organisationId');

  if (
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof passwordConfirm !== 'string' ||
    typeof organisationId !== 'string'
  ) {
    return badRequest({
      FormError: `Form not submitted correctly.`,
    });
  }
  const fields = { firstName, lastName, email, password, passwordConfirm };

  const fieldErrors = {
    firstName: validateText(firstName, {
      min: { length: 2, errorMessage: 'MOORE than 2' },
    }),
    lastName: validateText(lastName, {
      max: { length: 4, errorMessage: 'MAX 4' },
    }),
    password:
      password !== passwordConfirm ? 'WW komen niet overeen!' : undefined,
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  const user = await db.user.create({
    data: {
      firstName,
      lastName,
      email,
      passwordHash: password as string,
      organisationId,
    },
  });

  if (!user)
    return badRequest<ActionData>({ formError: 'Something went wrong.' });

  return redirect('/users');
};

type LoaderData = {
  organisations: Organisation[];
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const organisations = await db.organisation.findMany();

  return { organisations };
};

export default function UserCreateRoute() {
  const { organisations } = useLoaderData<LoaderData>();
  const data = useActionData<ActionData>();
  const fieldErrors = data?.fieldErrors;

  return (
    <div className="h-full p-24 bg-red-400">
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
          <label htmlFor="password">Wachtwoord</label>
          <input type="text" name="password" id="password" />
          <label htmlFor="passwordConfirm">Wachtwoord Bevestigen</label>
          <input type="text" name="passwordConfirm" id="passwordConfirm" />
          <label htmlFor="organisation">Organisatie</label>
          <select>
            <option className="text-gray-400">Kies een organisatie...</option>
            {organisations.map((organisation) => (
              <option key={organisation.id} value={organisation.id}>
                {organisation.name}
              </option>
            ))}
          </select>
          {/* <Combobox openOnFocus={true} aria-label="organisation">
            <ComboboxInput
              type="text"
              // onChange={handleSearchTermChange}
              name="organisation"
              id="organisation"
              className="w-full"
              onSelect={(event) => console.log('event', event)}
            />
            {organisations && (
              <ComboboxPopover className="shadow-popup">
                {organisations.length > 0 ? (
                  <ComboboxList>
                    {organisations.map((organisation) => (
                      <ComboboxOption
                        key={organisation.id}
                        value={organisation.id}
                      >
                        {organisation.name}
                      </ComboboxOption>
                    ))}
                  </ComboboxList>
                ) : (
                  <span style={{ display: 'block', margin: 8 }}>
                    No results found
                  </span>
                )}
              </ComboboxPopover>
            )}
          </Combobox> */}
        </fieldset>
        <button type="submit" className="btn btn-save">
          Opslaan
        </button>
      </form>
    </div>
  );
}
