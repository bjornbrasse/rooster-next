import * as React from 'react';
import { Task } from '@prisma/client';
import { useFetcher } from 'remix';
import { ActionData } from '~/routes/_api/task';
import { Field } from '../form-elements';

const TaskForm = ({
  onSaved: savedHandler,
  redirectTo = '/',
  ...args
}: {
  onSaved: (task: Task) => void;
  redirectTo?: string;
} & (
  | { departmentId: string; scheduleId?: string; task?: never }
  | { departmentId?: never; scheduleId?: never; task: Task }
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
    }
  }, [fetcher]);

  return (
    <fetcher.Form method="post" action="/_api/task" noValidate>
      {args?.departmentId && (
        <input type="hidden" name="departmentId" value={args.departmentId} />
      )}
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <input type="hidden" name="taskId" value={args.task?.id} />
      <input type="hidden" name="scheduleId" value={args.scheduleId} />

      <fieldset className="flex flex-col">
        <Field
          label="Naam"
          name="name"
          id="name"
          defaultValue={args.task?.name ?? ''}
          ref={focusRef}
        />
        <Field
          name="nameShort"
          label="Korte naam"
          defaultValue={args.task?.nameShort ?? ''}
        />
        <Field
          name="description"
          label="Omschrijving"
          defaultValue={args.task?.description ?? ''}
          type={'textarea'}
          rows={10}
        />
      </fieldset>
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
