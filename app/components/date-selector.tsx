import * as React from 'react';
import { Form } from 'remix';
import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import utc from 'dayjs/plugin/utc';
import { MONTHS, WEEKDAYS } from '~/utils/date';

dayjs.extend(weekday);
dayjs.extend(utc);

export const DateSelector: React.FC<{
  date: Date;
}> = ({ date: activeDate }) => {
  const previousMonthDays = React.useMemo(() => {
    const days: Dayjs[] = [];
    const numberOfPreviousMonthDays =
      (dayjs(activeDate).date(1).weekday() + 6) % 7;

    for (let i = 0; i < numberOfPreviousMonthDays; i++) {
      days.push(
        dayjs(activeDate)
          .date(1)
          .add(i - numberOfPreviousMonthDays, 'day'),
      );
    }

    return days;
  }, [activeDate]);

  const monthDays = React.useMemo(() => {
    const days: Dayjs[] = [];
    const numberOfMonthDays = dayjs(activeDate).daysInMonth();

    for (let i = 0; i < numberOfMonthDays; i++) {
      days.push(dayjs(activeDate).date(1).add(i, 'day'));
    }

    return days;
  }, [activeDate]);

  const nextMonthDays = React.useMemo(() => {
    const days: Dayjs[] = [];
    const numberOfNextMonthDays =
      7 - ((previousMonthDays.length + monthDays.length) % 7);

    for (let i = 0; i < numberOfNextMonthDays; i++) {
      days.push(dayjs(activeDate).date(1).add(1, 'month').add(i, 'day'));
    }

    return days;
  }, [activeDate]);

  const MenuButton: React.FC<{
    className?: string;
    icon: string;
    name: string;
    value: string;
  }> = ({ className, icon, name, value }) => (
    <button
      className={`rounded-md border border-gray-300 px-2 text-gray-300 hover:bg-blue-600 hover:text-white ${className}`}
      name={name}
      value={value}
    >
      <i className={icon} />
    </button>
  );

  const SelectMonthButton: React.FC<{
    value: 'previous' | 'next';
  }> = ({ value }) => (
    <MenuButton
      icon={`fas fa-chevron-${value === 'previous' ? 'left' : 'right'}`}
      name="date"
      value={dayjs(activeDate)
        .add(value === 'next' ? 1 : -1, 'month')
        .format('YYMMDD')}
    />
  );

  const DateField: React.FC<{
    date: Date;
  }> = ({ date }) => {
    const isActiveDate = dayjs(date).isSame(activeDate, 'day');
    const isCurrentMonth = date.getMonth() === activeDate.getMonth();
    const isToday = dayjs(date).isSame(new Date(), 'day');

    return (
      <button
        // onClick={() => setDate(date)}
        className={`${
          isActiveDate
            ? 'rounded-full bg-blue-500 text-white'
            : 'cursor-pointer hover:bg-gray-200'
        } ${isCurrentMonth ? 'text-gray-800' : 'text-gray-300'} ${
          isToday ? 'rounded-md border border-blue-900' : ''
        }`}
        name="date"
        type="submit"
        value={dayjs(date).format('YYMMDD')}
      >
        {dayjs(date).date()}
      </button>
    );
  };

  return (
    <Form method="get" replace>
      <div className="mb-2 flex justify-between">
        <div className="flex">
          <SelectMonthButton value="previous" />
          {!dayjs(activeDate).isSame(new Date(), 'month') && (
            <MenuButton
              className="ml-1"
              icon="fas fa-calendar-day"
              name="date"
              value={dayjs().format('YYMMDD')}
            />
          )}
        </div>
        <div className="flex text-xl md:text-2xl">
          <p className="text-center font-bold">
            {MONTHS[dayjs(activeDate).month()].name}
          </p>
          <p className="ml-2 text-center text-gray-400">
            {activeDate.getFullYear()}
          </p>
        </div>
        <SelectMonthButton value="next" />
      </div>
      <div className="grid grid-cols-7 border-b border-gray-400">
        {WEEKDAYS.map((_, i) => (
          <p className="text-center" key={i}>
            {WEEKDAYS[(i + 8) % 7].short}
          </p>
        ))}
      </div>
      <div className="lg:text-md justify-centerpt-2 my-2 grid grid-cols-7 items-center text-center text-lg">
        {previousMonthDays.map((day, i) => (
          <DateField date={day.toDate()} key={i} />
        ))}
        {monthDays.map((day, i) => (
          <DateField date={day.toDate()} key={i} />
        ))}
        {nextMonthDays.map((day, i) => (
          <DateField date={day.toDate()} key={i} />
        ))}
      </div>
    </Form>
  );
};
