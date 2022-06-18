import { Booking, User } from '@prisma/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useMemo, useState } from 'react';
import { Link } from 'remix';
import { WEEKDAYS } from '~/utils/date';
import { useSchedule } from '~/hooks/useSchedule';
import { getSchedule } from '~/routes/__navbar/$organisationSlug/$departmentSlug/$scheduleSlug';
import { usePopper } from 'react-popper';
import { SchedulePopover } from './popovers/schedule-popover';

dayjs.extend(utc);

interface IProps {
  activeDate: Date;
  bookings: (Booking & { user: User })[];
  rows: { id: string; caption: string }[];
  onSelect: (taskId: string) => void;
  schedule: Exclude<Awaited<ReturnType<typeof getSchedule>>, null>;
  startDate: Date;
  endDate: Date;
  view: 'person' | 'task';
}

export const DateGrid: React.FC<IProps> = ({
  bookings,
  activeDate,
  rows,
  onSelect: selectHander,
  schedule,
  startDate,
  endDate,
  view,
}) => {
  const { addToSelection } = useSchedule();

  const dates = useMemo(() => {
    const arr: Date[] = [];

    for (const dt = startDate; dt <= endDate; dt.setDate(dt.getDate() + 1)) {
      // arr.push(new Date(dt));
      arr.push(dayjs(dt).local().toDate());
    }

    return arr;
  }, [startDate, endDate]);

  const [popperElementRef, setPopperElementRef] =
    useState<HTMLDivElement | null>(null);
  const [referenceElementRef, setReferenceElementRef] =
    useState<HTMLTableDataCellElement | null>(null);

  const { styles, attributes } = usePopper(
    referenceElementRef,
    popperElementRef,
  );

  return (
    <div className="overflow-x-auto">
      <table>
        <thead className="bg-gray-200 dark:bg-transparent">
          <tr>
            <th className="sticky left-0 z-10 flex h-full border-r-2 border-blue-400 p-2">
              <span className="mr-4">
                {view === 'person' ? 'Personen' : 'Taken'}
              </span>
              <Link to={`/schedules/${schedule.id}`} className="btn btn-save">
                <i className="fas fa-pencil-alt"></i>
              </Link>
            </th>
            {dates.map((day, index) => {
              const isCurrentDate = day.getDate() === activeDate.getDate();

              return (
                <th
                  className={`border border-blue-200 px-2 ${
                    isCurrentDate ? 'bg-green-400' : null
                  }`}
                  key={index}
                >
                  <p className="font-normal">{WEEKDAYS[day.getDay()].short}</p>
                  <p>{day.getDate()}</p>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="sticky left-0 z-10 flex border-r-2 border-red-400">
                {row.caption}
              </td>
              {dates.map((date, index) => {
                const [isOpen, setIsOpen] = useState(false);

                const bks = bookings.filter(
                  (booking) =>
                    dayjs(booking.date).date() === dayjs(date).date() &&
                    booking.taskId === row.id,
                );
                const isCurrentDate = date.getDate() === activeDate.getDate();

                return (
                  <td
                    ref={setReferenceElementRef}
                    onClick={() => selectHander(row.id)}
                    onMouseOver={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    className={`relative cursor-pointer border border-blue-200 px-2 hover:bg-blue-200 ${
                      isCurrentDate ? 'bg-green-200' : null
                    }`}
                    key={index}
                  >
                    <div>
                      {bks.map((booking, index) => (
                        <p className="font-normal hover:bg-red-100" key={index}>
                          {booking.user.initials}
                        </p>
                      ))}
                      <h1>BB</h1>
                    </div>
                    <SchedulePopover
                      date={date}
                      isVisible={isOpen}
                      ref={setPopperElementRef}
                      task={{ id: row.id, name: row.caption }}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
