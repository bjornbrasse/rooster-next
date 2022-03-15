import * as React from "react";
import { User } from "@prisma/client";
import { useFetcher } from "remix";
import { UserActionData } from "~/routes/_api/user";

const UserForm = ({
  departmentId,
  onSaved: savedHandler,
  organisationId,
  redirectTo = "/",
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

  React.useEffect(() => {
    if (fetcher.data?.user) {
      savedHandler(fetcher.data.user);
    }
  }, [fetcher]);

  return (
    <fetcher.Form method="post" action="/user">
      <input type="hidden" name="userId" value={user?.id} />
      <input type="hidden" name="departmentId" value={departmentId} />
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
        {fetcher.data?.error?.fields?.firstName && (
          <p>Fout - {fetcher.data?.error?.fields?.firstName}</p>
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
    </fetcher.Form>
  );
};

export default UserForm;
