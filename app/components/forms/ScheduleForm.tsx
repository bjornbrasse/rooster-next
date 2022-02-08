import * as React from 'react';
import { Schedule } from '@prisma/client';
import { useFetcher } from 'remix';
import { ActionData } from '~/routes/_api/schedule';

export default function ScheduleForm({
  departmentId,
  onSaved: savedHandler,
  schedule,
}: {
  departmentId: string;
  onSaved: () => void;
  schedule?: Schedule;
}) {
  const fetcher = useFetcher<ActionData>();

  React.useEffect(() => {
    if (fetcher.data?.schedule && fetcher.state === 'idle') {
      savedHandler();
    }
  }, [fetcher]);

  return (
    <fetcher.Form method="post" action="/_api/schedule">
      <input type="hidden" name="departmentId" value={departmentId} />
      <fieldset className="flex flex-col">
        <label htmlFor="name">Naam</label>
        <input
          type="text"
          name="name"
          id="name"
          defaultValue={schedule?.name}
          autoFocus={true}
        />
        {fetcher.data?.error?.fields?.name && (
          <p>Fout - {fetcher.data?.error?.fields?.name}</p>
        )}
      </fieldset>
      <button type="submit" className="btn btn-save">
        Opslaan
      </button>
    </fetcher.Form>
  );
}
