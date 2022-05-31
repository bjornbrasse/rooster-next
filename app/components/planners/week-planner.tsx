import { Booking, Schedule, Task, User } from '@prisma/client';
import dayjs from 'dayjs';
import * as React from 'react';
import { Link } from 'remix';
import { useSchedule } from '~/hooks/useSchedule';
import useDate from '~/hooks/useDate';
import { WEEKDAYS } from '~/utils/date';

interface IProps {
  bookings: (Booking & { user: User })[];
  date: Date;
  schedule: Schedule;
  tasks: Task[];
}

export const WeekPlanner: React.FC<IProps> = ({
  bookings,
  date,
  schedule,
  tasks,
}) => {
  const { getWeekDays } = useDate(date);
  const { addToSelection } = useSchedule();

  const weekDays = getWeekDays();
  // const tasks = schedule.tasks;

  return (
    <div>
      <h2>Week</h2>
      <table>
        <thead className="bg-gray-200">
          <tr>
            <th className="flex">
              <p>Taken</p>
              <Link to={`/schedules/${schedule.id}`} className="btn btn-save">
                <i className="fas fa-pencil-alt"></i>
              </Link>
            </th>
            {weekDays.map((day, index) => {
              const isCurrentDate = day.getDate() === date.getDate();

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
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.name}</td>
              {weekDays.map((day, index) => {
                const bks = bookings.filter(
                  (booking) =>
                    dayjs(booking.date).date() === dayjs(day).date() &&
                    booking.taskId === task.id,
                );
                const isCurrentDate = day.getDate() === date.getDate();

                return (
                  <td
                    onClick={() =>
                      addToSelection({ date: day, task, bookings: bks })
                    }
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
    </div>
  );
};
