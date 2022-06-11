import { Schedule, ScheduleTask, Task } from '@prisma/client';
import { useFetcher } from 'remix';
import { ActionData } from '~/routes/_api/schedule/task/addOrEdit';
import { useEffect, useState } from 'react';
import { Field } from '../form-elements';
import { DatePicker, links as datePickerLinks } from '../date-picker';
import dayjs from 'dayjs';

export const links = () => [...datePickerLinks()];

export default function ScheduleTaskForm({
  onSaved: savedHandler,
  ...args
}: {
  onSaved: (scheduleTask: ScheduleTask) => void;
} & (
  | {
      scheduleTask: ScheduleTask & { schedule: Schedule; task: Task };
      schedule?: never;
      task?: never;
    }
  | { scheduleTask?: never; schedule: Schedule; task: Task }
)) {
  const [startDate, setStartDate] = useState(
    args?.scheduleTask
      ? args.scheduleTask.startDate
      : dayjs().startOf('month').add(1, 'month').toDate(),
  );
  const [endDate, setEndDate] = useState(
    args?.scheduleTask
      ? args.scheduleTask.endDate
      : dayjs().add(12, 'months').endOf('month').toDate(),
  );

  const fetcher = useFetcher<ActionData>();
  const data = fetcher?.data;

  useEffect(() => {
    if (data?.success && fetcher.state === 'idle') {
      savedHandler(data.scheduleTask);
    }
  }, [fetcher]);

  const scheduleId = args?.scheduleTask
    ? args.scheduleTask.schedule.id
    : args.schedule.id;
  const taskId = args?.scheduleTask ? args.scheduleTask.task.id : args.task.id;

  return (
    <fetcher.Form method="post" action="/_api/schedule/task/addOrEdit">
      <input
        type="hidden"
        name="_action"
        value={args?.scheduleTask ? 'update' : 'create'}
      />
      <input type="hidden" name="scheduleId" value={scheduleId} />
      <input type="hidden" name="taskId" value={taskId} />

      <h1>
        {args?.scheduleTask
          ? args.scheduleTask.schedule.name
          : args.schedule.name}
      </h1>
      <h1>
        {args?.scheduleTask ? args.scheduleTask.task.name : args.task.name}
      </h1>

      <label htmlFor="startDate">
        Startdatum
        <DatePicker
          id="startDate"
          date={startDate}
          dateFormat="d MMMM yyyy"
          name="startDate"
          onChange={(date: Date) => setStartDate(date)}
          className="w-48"
        />
      </label>
      <label htmlFor="endDate">
        Einddatum
        <DatePicker
          id="endDate"
          date={endDate}
          dateFormat="d MMMM yyyy"
          name="endDate"
          onChange={(date: Date) => setEndDate(date)}
          className="w-48"
        />
      </label>
      <button type="submit" className="btn btn-save">
        Opslaan
      </button>
    </fetcher.Form>
  );
}
