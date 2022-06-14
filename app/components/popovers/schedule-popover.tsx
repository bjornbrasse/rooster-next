import dayjs from 'dayjs';
import { forwardRef } from 'react';
import { useFetcher } from 'remix';
import { MONTHS, WEEKDAYS } from '~/utils/date';

interface IProps {
  date: Date;
  isVisible: boolean;
  task: { id: string; name: string };
}

export const SchedulePopover = forwardRef<HTMLDivElement | null, IProps>(
  ({ date, isVisible, task }, ref) => {
    const fetcher = useFetcher();

    return (
      <div
        className={`fixed z-20 rounded-sm border border-blue-400 bg-gray-100 p-2 px-4 py-2 text-black ${
          isVisible ? 'visible' : 'invisible'
        }`}
        ref={ref}
      >
        <p>{`${WEEKDAYS[dayjs(date).weekday()].name.nl} ${dayjs(date).date()} ${
          MONTHS[dayjs(date).month()].name
        }`}</p>
        <h3>{task.name}</h3>
        <fetcher.Form action="/_api/booking/add" method="post">
          <input type="hidden" name="taskId" value={task.id} />
          <input
            type="hidden"
            name="date"
            value={dayjs(date)
              .add(dayjs(date).utcOffset(), 'minutes')
              .toISOString()}
          />
          <button className="btn btn-save" type="submit">
            Mij Toewijzen
          </button>
        </fetcher.Form>
      </div>
    );
  },
);
