import * as React from 'react';
import { User } from '@prisma/client';
import { redirect, useActionData } from 'remix';
import { ActionData } from '~/user';

const UserForm = ({
  organisationId,
  redirectTo = '/users',
  user,
}: {
  organisationId: string;
  redirectTo?: string;
  user?: User;
}) => {
  const data = useActionData<ActionData>();
  const [changingPassword, setChangingPassword] = React.useState(false);

  return (
    <form method="POST" action="/user">
      <input type="hidden" name="userId" value={user?.id} />
      <input type="hidden" name="organisationId" value={organisationId} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <fieldset className="flex flex-col">
        <label htmlFor="firstName">Voornaam</label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          defaultValue={user?.firstName}
        />
        {data?.fieldErrors?.firstName && (
          <p>Fout - {data?.fieldErrors.firstName}</p>
        )}
        <label htmlFor="lastName">Achternaam</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          defaultValue={user?.lastName}
        />
        <label htmlFor="email">Email</label>
        <input type="text" name="email" id="email" defaultValue={user?.email} />
        <button
          type="button"
          onClick={() => setChangingPassword(!changingPassword)}
          className="col-span-2 btn btn-save"
        >
          Verander wachtwoord
        </button>
        {changingPassword && (
          <>
            <label htmlFor="password">Wachtwoord</label>
            <input type="text" name="password" id="password" />
            <label htmlFor="passwordConfirm">Bevestig wachtwoord</label>
            <input type="text" name="passwordConfirm" id="passwordConfirm" />
          </>
        )}
      </fieldset>
      <button type="submit" className="btn btn-save">
        Opslaan
      </button>
    </form>
  );
};

export default UserForm;
