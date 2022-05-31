import { Schedule, ScheduleTask, Task } from '@prisma/client';
import { useFetcher } from 'remix';
import { ActionData } from '~/routes/_api/schedule-task';
import { useEffect } from 'react';
import { Field } from '../form-elements';

export default function ScheduleTaskForm({
  onSaved: savedHandler,
  schedule,
  task,
}: {
  onSaved: (scheduleTask: ScheduleTask) => void;
  schedule: Schedule;
  task: Task;
}) {
  const fetcher = useFetcher<ActionData>();
  const data = fetcher?.data;

  useEffect(() => {
    if (data?.success && fetcher.state === 'idle') {
      savedHandler(data.scheduleTask);
    }
  }, [fetcher]);

  return (
    <fetcher.Form method="post" action="/_api/schedule-task">
      <h1>{schedule.name}</h1>
      <h1>{task.name}</h1>
      <input type="hidden" name="scheduleId" value={schedule.id} />
      <input type="hidden" name="taskId" value={task.id} />
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
