import dayjs, { Dayjs } from 'dayjs';

export default function useDate(date: Date) {
  function getFirstDayOfTheWeek(date: Date): Date {
    const d = dayjs(date);
    return d.subtract((date.getDay() + 6) % 7, 'days').toDate();
  }

  function getWeekDays(): Date[] {
    const firstDayOfTheWeek = getFirstDayOfTheWeek(date);
    const days: Date[] = [];

    for (let i = 0; i < 7; i++) {
      days.push(dayjs(firstDayOfTheWeek).add(i, 'days').toDate());
    }

    return days;
  }

  return {
    getFirstDayOfTheWeek,
    getWeekDays,
  };
}
