import { Schedule, ScheduleMember, User } from '@prisma/client';
import { useFetcher } from 'remix';
import { ActionData } from '~/routes/_api/schedule/member/addOrEdit';
import { useEffect } from 'react';
import { Field } from '../form-elements';

export default function ScheduleMemberForm({
  onSaved: savedHandler,
  schedule,
  member,
}: {
  onSaved: (scheduleMember: ScheduleMember) => void;
  schedule: Schedule;
  member: User;
}) {
  const fetcher = useFetcher<ActionData>();
  const data = fetcher?.data;

  useEffect(() => {
    if (data?.success && fetcher.state === 'idle') {
      savedHandler(data.scheduleMember);
    }
  }, [fetcher]);

  return (
    <fetcher.Form method="post" action="/_api/schedule-task">
      <h1>{schedule.name}</h1>
      <h1>{member.firstName}</h1>
      <input type="hidden" name="scheduleId" value={schedule.id} />
      <input type="hidden" name="memberId" value={member.id} />
      {/* <Field
        name="name"
        label="Naam"
        error={data && !data.success ? data.errors?.fieldErrors?.name : null}
      />
      <Field
        name="slug"
        label="Slug"
        error={data && !data.success ? data.errors?.fieldErrors?.name : null}
      /> */}
      <button type="submit" className="btn btn-save">
        Opslaan
      </button>
    </fetcher.Form>
  );
}
