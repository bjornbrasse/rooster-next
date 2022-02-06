import * as React from 'react';
import { Organisation } from '@prisma/client';
import { useFetcher } from 'remix';
import { ActionData } from '~/routes/__api/organisation';

export default function OrganisationForm({
  // onSaved: savedHandler,
  organisation,
  organisationSlug,
  redirectTo = `/${organisationSlug}/organisations`,
}: {
  // onSaved: (user: User) => void;
  organisation?: Organisation;
  redirectTo?: string;
  organisationSlug: string;
}) {
  const fetcher = useFetcher<ActionData>();

  React.useEffect(() => {
    if (fetcher.data?.organisation) {
      // savedHandler(fetcher.data.Organisation);
    }
  }, [fetcher]);

  return (
    <fetcher.Form method="post" action="/__api/organisation">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <fieldset className="flex flex-col">
        <label htmlFor="name">Naam</label>
        <input
          type="text"
          name="name"
          id="name"
          defaultValue={organisation?.name}
        />
        {fetcher.data?.error?.fields?.name && (
          <p>Fout - {fetcher.data?.error?.fields?.name}</p>
        )}
        <label htmlFor="nameShort">Korte naam</label>
        <input
          type="text"
          name="nameShort"
          id="nameShort"
          defaultValue={organisation?.nameShort}
        />
        <label htmlFor="slugName">Slug</label>
        <input
          type="text"
          name="slugName"
          id="slugName"
          defaultValue={organisation?.slugName}
        />
      </fieldset>
      <button type="submit" className="btn btn-save">
        Opslaan
      </button>
    </fetcher.Form>
  );
}
