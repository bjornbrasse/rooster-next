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
    <div className="overflow-y-auto">
      <div
        className="relative grid grid-flow-row auto-rows-auto"
        style={{
          gridTemplateColumns: `repeat(${dates.length}, minmax(0, 1fr))`,
        }}
      >
        <div className="sticky left-0 z-10 flex h-full w-24 border-r-2 border-blue-400 bg-gray-200">
          <span>{view === 'person' ? 'Personen' : 'Taken'}</span>
          <Link to={`/schedules/${schedule.id}`} className="btn btn-save">
            <i className="fas fa-pencil-alt"></i>
          </Link>
        </div>
        <div className="bg-red-400 text-center" style={{ columnCount: 7 }}>
          Augustus
        </div>
        {dates.map((day, index) => {
          const isCurrentDate = day.getDate() === activeDate.getDate();

          return (
            <div
              className={`flex flex-col items-center border border-blue-200 px-2 ${
                isCurrentDate ? 'bg-green-400' : null
              }`}
              key={index}
            >
              <span className="font-normal">
                {WEEKDAYS[day.getDay()].short}
              </span>
              <span>{day.getDate()}</span>
            </div>
          );
        })}
        <div className="flex h-full w-24 border-r-2 border-blue-400 bg-gray-200">
          <span>{view === 'person' ? 'Personen' : 'Taken'}</span>
          <Link to={`/schedules/${schedule.id}`} className="btn btn-save">
            <i className="fas fa-pencil-alt"></i>
          </Link>
        </div>
        <div className="flex h-full w-24 border-r-2 border-blue-400 bg-gray-200">
          <span>{view === 'person' ? 'Personen' : 'Taken'}</span>
          <Link to={`/schedules/${schedule.id}`} className="btn btn-save">
            <i className="fas fa-pencil-alt"></i>
          </Link>
        </div>
        <div className="flex h-full w-24 border-r-2 border-blue-400 bg-gray-200">
          <span>{view === 'person' ? 'Personen' : 'Taken'}</span>
          <Link to={`/schedules/${schedule.id}`} className="btn btn-save">
            <i className="fas fa-pencil-alt"></i>
          </Link>
        </div>
        <div className="flex h-full w-24 border-r-2 border-blue-400 bg-gray-200">
          <span>{view === 'person' ? 'Personen' : 'Taken'}</span>
          <Link to={`/schedules/${schedule.id}`} className="btn btn-save">
            <i className="fas fa-pencil-alt"></i>
          </Link>
        </div>
        <div className="flex h-full w-24 border-r-2 border-blue-400 bg-gray-200">
          <span>{view === 'person' ? 'Personen' : 'Taken'}</span>
          <Link to={`/schedules/${schedule.id}`} className="btn btn-save">
            <i className="fas fa-pencil-alt"></i>
          </Link>
        </div>
        {/* <tbody>
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
        </tbody> */}
      </div>
    </div>
  );
};
