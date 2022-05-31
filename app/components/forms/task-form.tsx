import * as React from 'react';
import { Task } from '@prisma/client';
import { useFetcher } from 'remix';
import { ActionData } from '~/routes/_api/task';
import { useDialog } from '~/contexts/dialog';
import { Field } from '../form-elements';

const TaskForm = ({
  onSaved: savedHandler,
  redirectTo = '/',
  ...args
}: {
  onSaved: (task: Task) => void;
  redirectTo?: string;
} & (
  | { departmentId: string; task?: never }
  | { departmentId?: never; task: Task }
)) => {
  const fetcher = useFetcher<ActionData>();
  const focusRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (focusRef?.current) {
      focusRef.current?.focus();
    }
  }, [focusRef]);

  React.useEffect(() => {
    if (fetcher.data?.success && fetcher.data.task) {
      savedHandler(fetcher.data.task);
      // return setTimeout(() => closeDialog(), 100);
    }
  }, [fetcher]);

  return (
    <fetcher.Form method="post" action="/_api/task">
      {args?.departmentId && (
        <input type="hidden" name="departmentId" value={args.departmentId} />
      )}
      <input type="hidden" name="redirectTo" value={redirectTo} />
      {/* <input type="hidden" name="taskId" value={task?.id} /> */}

      <fieldset className="flex flex-col">
        <label htmlFor="firstName">Taak</label>
        <input
          type="text"
          name="name"
          id="name"
          defaultValue={args?.task ? args.task.name : ''}
          ref={focusRef}
        />
        {/* {fetcher.data?.error?.fields?.name && (
          <p>Fout - {fetcher.data?.error?.fields?.name}</p>
        )} */}
      </fieldset>
      <Field
        name="description"
        label="Omschrijving"
        type={'textarea'}
        rows={10}
      />
      <button
        className="btn btn-save"
        name="_action"
        type="submit"
        value={args.task?.id ? 'update' : 'create'}
      >
        Opslaan
      </button>
    </fetcher.Form>
  );
};

export default TaskForm;
