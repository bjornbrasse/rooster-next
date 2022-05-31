import { useEffect } from 'react';
import { Department } from '@prisma/client';
import { useFetcher } from 'remix';
import { ActionData } from '~/routes/_api/department';

export default function DepartmentForm(args: {
  onSaved: (department: Department) => void;
  department?: Department;
  redirectTo?: string;
  organisationId: string;
}) {
  const fetcher = useFetcher<ActionData>();
  const { department, organisationId, redirectTo } = args;

  useEffect(() => {
    if (fetcher.data?.success) {
      console.log('het is gelukt!!');
    }
  }, [fetcher]);

  return (
    <fetcher.Form method="post" action="/_api/department">
      <input type="hidden" name="organisationId" value={organisationId} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <fieldset className="flex flex-col">
        <label htmlFor="name">Naam</label>
        <input
          type="text"
          name="name"
          id="name"
          defaultValue={department?.name}
        />
        {!fetcher.data?.success && fetcher.data?.errors?.fieldErrors?.name && (
          <p>Fout - {fetcher.data.errors.fieldErrors.name}</p>
        )}
        <label htmlFor="nameShort">Korte naam</label>
        <input
          type="text"
          name="nameShort"
          id="nameShort"
          defaultValue={department?.nameShort ?? ''}
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
