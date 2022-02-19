import dayjs, { Dayjs } from 'dayjs';

export default function useDate() {
  function getFirstDayOfTheWeek(date: Date): Dayjs {
    const d = dayjs(date);
    return d.subtract((date.getDay() + 6) % 7, 'days');
  }

  return {
    getFirstDayOfTheWeek,
  };
}
