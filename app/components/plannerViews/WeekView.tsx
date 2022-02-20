import { Task } from '@prisma/client';
import * as React from 'react';
import useDate from '~/hooks/useDate';
import { WEEKDAYS } from '~/utils/date';

const PlannerWeekView: React.FC<{ date: Date; tasks: Task[] }> = ({
  date,
  tasks,
}) => {
  const { getWeekDays } = useDate(date);

  const weekDays = getWeekDays();

  return (
    <div>
      <h2>Week</h2>
      <p>{date.toISOString()}</p>
      <table>
        <thead className="bg-gray-200">
          <tr>
            <th>Taken</th>
            {weekDays.map((day, index) => {
              const isCurrentDate = day.getDate() === date.getDate();

              return (
                <th
                  className={`px-2 border border-blue-200 ${
                    isCurrentDate ? 'bg-green-400' : null
                  }`}
                  key={index}
                >
                  <p className="font-normal">{WEEKDAYS[day.getDay()]}</p>
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
                    className={`px-2 border border-blue-200 ${
                      isCurrentDate ? 'bg-green-200' : null
                    }`}
                    key={index}
                  >
                    <p className="font-normal">{WEEKDAYS[day.getDay()]}</p>
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
