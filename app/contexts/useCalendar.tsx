import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarView } from '@/utils/enums';
import { convertArrayToObject, convertMAP } from '@/utils/helper';
import { tasks } from 'data/tasks';

export type RowType = 'task' | 'person';

export type Day = {
  date: Dayjs;
  isWeekendDay: boolean;
};

// type CalendarDays = {
//   firstDay: Dayjs;
//   lastDay: Dayjs;
//   days: Day[];
// };

type TUseCalendar = {
  // activeDayTask: DayTask;
  activeDate: Dayjs;
  calendarView: CalendarView;
  // calendarDays: CalendarDays;
  days: Day[];
  rowType: RowType;
  setRowType: React.Dispatch<React.SetStateAction<RowType>>;
  setActiveDate: React.Dispatch<React.SetStateAction<Dayjs>>;
  setCalendarView: React.Dispatch<React.SetStateAction<CalendarView>>;
  showDateSelector: boolean;
  setShowDateSelector: React.Dispatch<React.SetStateAction<boolean>>;
  moveCalendarView: (direction: 'previous' | 'next') => void;
};

export function useCalendar(): TUseCalendar {
  const [activeDate, setActiveDate] = React.useState<Dayjs>(
    dayjs().startOf('date')
  );
  const [calendarView, setCalendarView] = React.useState<CalendarView>(
    CalendarView.Week
  );
  const [showDateSelector, setShowDateSelector] = React.useState(false);
  const [firstDay, setFirstDay] = React.useState<Dayjs>(null);
  const [lastDay, setLastDay] = React.useState<Dayjs>(null);
  const [rowType, setRowType] = React.useState<RowType>('task');

  const moveCalendarView = (direction: 'previous' | 'next') => {
    setActiveDate((prev) =>
      dayjs(prev).add(
        direction === 'previous' ? -1 : 1,
        calendarView === CalendarView.Month
          ? 'month'
          : calendarView === CalendarView.Day
          ? 'day'
          : 'week'
      )
    );
  };

  const days = React.useMemo<Day[]>(() => {
    let days: Day[] = [];
    const count = lastDay?.diff(firstDay, 'days') + 1;

    for (let d = 0; d < count; d++) {
      days[d] = {
        date: firstDay?.add(d, 'day'),
        isWeekendDay:
          firstDay?.add(d, 'day').day() === 0 ||
          firstDay?.add(d, 'day').day() === 6,
      };
    }

    return days;
  }, [firstDay, lastDay]);

  React.useEffect(() => {
    let first: Dayjs;
    let last: Dayjs;

    switch (calendarView) {
      case CalendarView.Day:
        first = activeDate.startOf('date');
        last = activeDate.endOf('date');
        break;
      case CalendarView.Day5:
        first = activeDate
          .add(-(activeDate.day() + 13) % 7, 'day')
          .startOf('date');
        last = activeDate
          .add(-(activeDate.day() + 13) % 7, 'day')
          .add(4, 'day')
          .startOf('date');
        if (activeDate.day() === 0) setActiveDate(activeDate.add(-2, 'day'));
        if (activeDate.day() === 6) setActiveDate(activeDate.add(-1, 'day'));
        break;
      case CalendarView.Week:
        first = activeDate
          .add(-(activeDate.day() + 13) % 7, 'day')
          .startOf('date');
        last = activeDate
          .add(-(activeDate.day() + 13) % 7, 'day')
          .add(6, 'day')
          .startOf('date');
        break;
      case CalendarView.Week2:
        first = activeDate
          .add(-(activeDate.day() + 13) % 7, 'day')
          .startOf('date');
        last = activeDate
          .add(-(activeDate.day() + 13) % 7, 'day')
          .add(13, 'day')
          .startOf('date');
        break;
      case CalendarView.Week3:
        first = activeDate
          .add(-(activeDate.day() + 13) % 7, 'day')
          .startOf('date');
        last = activeDate
          .add(-(activeDate.day() + 13) % 7, 'day')
          .add(20, 'day')
          .startOf('date');
        break;
      case CalendarView.Month:
        first = activeDate.startOf('month');
        last = activeDate.endOf('month');
        break;
    }

    if (first.toISOString() !== firstDay?.toISOString()) setFirstDay(first);
    if (last.toISOString() !== lastDay?.toISOString()) setLastDay(last);
  }, [activeDate, calendarView]);

  return {
    activeDate,
    calendarView,
    days,
    moveCalendarView,
    rowType,
    setActiveDate,
    setCalendarView,
    setRowType,
    setShowDateSelector,
    showDateSelector,
  };
}

export const CalendarProvider = ({ children }) => {};
