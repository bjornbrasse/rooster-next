import { Booking, User } from '@prisma/client';
import dayjs from 'dayjs';
import * as React from 'react';
import { Link } from 'remix';
import { WEEKDAYS } from '~/utils/date';
import { useSchedule } from '~/hooks/useSchedule';
import { getSchedule } from '~/routes/__app/$organisationSlug/$departmentSlug/$scheduleSlug';

export const DateGrid: React.FC<{
  activeDate: Date;
  bookings: (Booking & { user: User })[];
  rows: { id: string; caption: string }[];
  onSelect: (taskId: string) => void;
  schedule: Exclude<Awaited<ReturnType<typeof getSchedule>>, null>;
  dates: Date[];
  view: 'person' | 'task';
}> = ({
  bookings,
  activeDate,
  dates,
  rows,
  onSelect: selectHander,
  schedule,
  view,
}) => {
  const { addToSelection } = useSchedule();

  return (
    <table className="relative">
      <thead className="bg-gray-200">
        <tr>
          <th className="sticky left-0 z-10 flex h-full border-r-2 border-blue-400 bg-gray-200">
            <span>{view === 'person' ? 'Personen' : 'Taken'}</span>
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
            <td className="sticky left-0 z-10 flex border-r-2 border-blue-400 bg-gray-100">
              {row.caption}
            </td>
            {dates.map((day, index) => {
              const bks = bookings.filter(
                (booking) =>
                  dayjs(booking.date).date() === dayjs(day).date() &&
                  booking.taskId === row.id,
              );
              const isCurrentDate = day.getDate() === activeDate.getDate();

              return (
                <td
                  onClick={() => selectHander(row.id)}
                  className={`cursor-pointer border border-blue-200 px-2 hover:bg-blue-200 ${
                    isCurrentDate ? 'bg-green-200' : null
                  }`}
                  key={index}
                >
                  {bks.map((booking, index) => (
                    <p className="font-normal hover:bg-red-100" key={index}>
                      {booking.user.initials}
                    </p>
                  ))}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
