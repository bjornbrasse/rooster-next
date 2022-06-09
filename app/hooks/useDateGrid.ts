import dayjs from 'dayjs';

export const useDateGrid = (currentDate: Date, period: 'month' | 'week') => {
  console.log('wat is dit voor een datum?', currentDate);

  function getMonthDays(currentDate: Date): Date[] {
    const daysInMonth = dayjs(currentDate).daysInMonth();
    const firstDayOfTheMonth = dayjs(currentDate).set('date', 1);
    const days: Date[] = [];

    for (let i = 0; i < daysInMonth; i++) {
      days.push(dayjs(firstDayOfTheMonth).add(i, 'days').toDate());
    }

    return days;
  }

  function getWeekDays(currentDate: Date): Date[] {
    const firstDayOfTheWeek = dayjs(currentDate).subtract(
      (currentDate.getDay() + 6) % 7,
      'days',
    );
    const days: Date[] = [];

    for (let i = 0; i < 7; i++) {
      days.push(dayjs(firstDayOfTheWeek).add(i, 'days').toDate());
    }

    return days;
  }

  function getScheduleDays() {
    return period === 'month'
      ? getMonthDays(currentDate)
      : getWeekDays(currentDate);
  }

  const scheduleDays: Date[] =
    period === 'month' ? getMonthDays(currentDate) : getWeekDays(currentDate);

  return {
    getScheduleDays,
    scheduleDays,
  };
};
