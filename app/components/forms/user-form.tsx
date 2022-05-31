import * as React from 'react';
import { User } from '@prisma/client';
import { useFetcher } from 'remix';
import { ActionData as UserActionData } from '~/routes/_api/user';
import { Field } from '~/components/form-elements';

export const UserForm = ({
  departmentId,
  onSaved: savedHandler,
  organisationId,
  redirectTo = '/',
  user,
}: {
  onSaved: (user: User) => void;
  departmentId?: string;
  organisationId: string;
  redirectTo?: string;
  user?: User;
}) => {
  const fetcher = useFetcher<UserActionData>();
  const [changingPassword, setChangingPassword] = React.useState(false);

  const data = fetcher?.data;

  React.useEffect(() => {
    if (data?.success && data.user) {
      savedHandler(data.user);
    }
  }, [fetcher]);

  return (
    <fetcher.Form method="post" action="/_api/user">
      <input type="hidden" name="userId" value={user?.id} />
      <input type="hidden" name="organisationId" value={organisationId} />
      {/* <input type="hidden" name="redirectTo" value={redirectTo} /> */}
      {/* <fieldset className="flex flex-col"> */}
      <Field
        name="firstName"
        label="Voornaam"
        error={
          data && !data.success ? data.errors?.fieldErrors?.firstName : null
        }
        autoFocus
      />
      <Field
        name="lastName"
        label="Achternaam"
        error={
          data && !data.success ? data.errors?.fieldErrors?.lastName : null
        }
      />
      <Field
        name="email"
        label="Email"
        error={data && !data.success ? data.errors?.fieldErrors?.email : null}
      />
      <Field
        name="initials"
        label="Initialen"
        error={
          data && !data.success ? data.errors?.fieldErrors?.initials : null
        }
      />
      {/* <button
          type="button"
          onClick={() => setChangingPassword(!changingPassword)}
          className="btn btn-save col-span-2"
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
        )} */}
      {/* </fieldset> */}
      <button type="submit" className="btn btn-save">
        Opslaan
      </button>
    </fetcher.Form>
  );
};
