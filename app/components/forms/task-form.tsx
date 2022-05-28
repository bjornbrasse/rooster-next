import * as React from 'react';
import { Task } from '@prisma/client';
import { useFetcher } from 'remix';
import { ActionData } from '~/routes/_api/task';
import { useDialog } from '~/contexts/dialog';

const TaskForm = ({
  onSaved: savedHandler,
  redirectTo = '/',
  departmentId,
  task,
}: {
  onSaved: (task: Task) => void;
  redirectTo?: string;
  departmentId: string;
  task?: Task;
}) => {
  const fetcher = useFetcher<ActionData>();
  const focusRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (focusRef?.current) {
      focusRef.current?.focus();
    }
  }, [focusRef]);

  React.useEffect(() => {
    if (fetcher.data?.task) {
      savedHandler(fetcher.data.task);
      // return setTimeout(() => closeDialog(), 100);
    }
  }, [fetcher]);

  return (
    <fetcher.Form method="post" action="/_api/task">
      <input type="hidden" name="departmentId" value={departmentId} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      {/* <input type="hidden" name="taskId" value={task?.id} /> */}

      <fieldset className="flex flex-col">
        <label htmlFor="firstName">Taak</label>
        <input type="text" name="name" id="name" ref={focusRef} />
        {/* {fetcher.data?.error?.fields?.name && (
          <p>Fout - {fetcher.data?.error?.fields?.name}</p>
        )} */}
      </fieldset>
      <button type="submit" className="btn btn-save">
        Opslaan
      </button>
    </fetcher.Form>
  );
};

export default TaskForm;
