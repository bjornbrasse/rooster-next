import { Schedule } from '@prisma/client';
import { useFetcher } from 'remix';
import { ActionData } from '~/routes/_api/schedule';
import { useEffect } from 'react';
import { Field } from '../form-elements';

export default function ScheduleForm({
  departmentId,
  onSaved: savedHandler,
  schedule,
}: {
  departmentId: string;
  onSaved: (schedule: Schedule) => void;
  schedule?: Schedule;
}) {
  const fetcher = useFetcher<ActionData>();
  const data = fetcher?.data;

  useEffect(() => {
    if (data?.success && fetcher.state === 'idle') {
      savedHandler(data.schedule);
    }
  }, [fetcher]);

  return (
    <fetcher.Form method="post" action="/_api/schedule">
      <input type="hidden" name="departmentId" value={departmentId} />
      <Field
        name="name"
        label="Naam"
        error={data && !data.success ? data.errors?.fieldErrors?.name : null}
      />
      <Field
        name="slug"
        label="Slug"
        error={data && !data.success ? data.errors?.fieldErrors?.name : null}
      />
      <button type="submit" className="btn btn-save">
        Opslaan
      </button>
    </fetcher.Form>
  );
}
