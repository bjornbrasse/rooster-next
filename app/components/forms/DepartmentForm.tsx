import * as React from 'react';
import { Department } from '@prisma/client';
import { useFetcher } from 'remix';
import { ActionData } from '~/routes/_api/department';

export default function DepartmentForm({
  // onSaved: savedHandler,
  department,
  organisationSlug,
  redirectTo = `/${organisationSlug}/departments`,
}: {
  // onSaved: (user: User) => void;
  department?: Department;
  redirectTo?: string;
  organisationSlug: string;
}) {
  const fetcher = useFetcher<ActionData>();

  React.useEffect(() => {
    if (fetcher.data?.department) {
      // savedHandler(fetcher.data.department);
    }
  }, [fetcher]);

  return (
    <fetcher.Form method="post" action="/_api/department">
      <input type="hidden" name="organisationSlug" value={organisationSlug} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <fieldset className="flex flex-col">
        <label htmlFor="name">Naam</label>
        <input
          type="text"
          name="name"
          id="name"
          defaultValue={department?.name}
        />
        {fetcher.data?.error?.fields?.name && (
          <p>Fout - {fetcher.data?.error?.fields?.name}</p>
        )}
        <label htmlFor="nameShort">Korte naam</label>
        <input
          type="text"
          name="nameShort"
          id="nameShort"
          defaultValue={department?.nameShort}
        />
        <label htmlFor="slug">Slug</label>
        <input
          type="text"
          name="slug"
          id="slug"
          defaultValue={department?.slug}
        />
      </fieldset>
      <button type="submit" className="btn btn-save">
        Opslaan
      </button>
    </fetcher.Form>
  );
}
