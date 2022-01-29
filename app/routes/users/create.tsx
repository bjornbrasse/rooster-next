import * as React from 'react';
import { ActionFunction, redirect, useActionData } from 'remix';
import { ActionData, createUser } from '~/user';

export const action: ActionFunction = async ({ request }) => {
  const res = await createUser({ request });

  return redirect('/users');
};

export default function UserCreateRoute() {
  const data = useActionData<ActionData>();
  const fieldErrors = data?.fieldErrors;

  return (
    <div className="h-full p-24 bg-red-400">
      <h1>Create User</h1>
      <form method="POST" className="w-1/2">
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
        </fieldset>
        <button type="submit" className="btn btn-save">
          Opslaan
        </button>
      </form>
    </div>
  );
}
