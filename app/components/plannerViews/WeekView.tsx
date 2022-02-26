import { Schedule, Task } from '@prisma/client';
import * as React from 'react';
import { Link } from 'remix';
import { useSchedule } from '~/contexts/schedule';
import useDate from '~/hooks/useDate';
import { WEEKDAYS } from '~/utils/date';

const PlannerWeekView: React.FC<{
  date: Date;
  schedule: Schedule;
  tasks: Task[];
}> = ({ date, schedule, tasks }) => {
  const { getWeekDays } = useDate(date);
  const { addToSelection } = useSchedule();

  const weekDays = getWeekDays();

  return (
    <div>
      <h2>Week</h2>
      <p>{date.toISOString()}</p>
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
                  className={`px-2 border border-blue-200 ${
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
                const isCurrentDate = day.getDate() === date.getDate();

                return (
                  <td
                    onClick={() =>
                      addToSelection({ date: day, task, user: 'test' })
                    }
                    className={`px-2 border border-blue-200 ${
                      isCurrentDate ? 'bg-green-200' : null
                    }`}
                    key={index}
                  >
                    <p className="font-normal">
                      {WEEKDAYS[day.getDay()].short}
                    </p>
                    <p>{day.getDate()}</p>
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

export default PlannerWeekView;
