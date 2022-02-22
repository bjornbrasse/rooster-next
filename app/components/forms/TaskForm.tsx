import * as React from 'react';
import { Task } from '@prisma/client';
import { useFetcher } from 'remix';
import { ActionData } from '~/routes/_api/task';

const TaskForm = ({
  onSaved: savedHandler,
  redirectTo = '/',
  scheduleId,
  task,
}: {
  onSaved: (task: Task) => void;
  redirectTo: string;
  scheduleId: string;
  task?: Task;
}) => {
  const fetcher = useFetcher<ActionData>();

  React.useEffect(() => {
    if (fetcher.data?.task) {
      savedHandler(fetcher.data.task);
    }
  }, [fetcher]);

  return (
    <fetcher.Form method="post" action="/_api/task">
      <input type="hidden" name="scheduleId" value={scheduleId} />
      <input type="hidden" name="taskId" value={task?.id} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <fieldset className="flex flex-col">
        <label htmlFor="firstName">Taak</label>
        <input type="text" name="name" id="name" defaultValue={task?.name} />
        {fetcher.data?.error?.fields?.name && (
          <p>Fout - {fetcher.data?.error?.fields?.name}</p>
        )}
      </fieldset>
      <button type="submit" className="btn btn-save">
        Opslaan
      </button>
    </fetcher.Form>
  );
};

export default TaskForm;
