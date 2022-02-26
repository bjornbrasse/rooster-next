import * as React from 'react';
import { useSubmit, useLocation, useSearchParams, Form } from 'remix';
import dayjs, { Dayjs } from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import utc from 'dayjs/plugin/utc';
import { MONTHS, WEEKDAYS } from '~/utils/date';

dayjs.extend(weekday);
dayjs.extend(utc);

const DateSelector: React.FC<{ date: Dayjs }> = ({ children, date }) => {
  const submit = useSubmit();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const days = React.useMemo(() => {
    const daysArray = [];

    const numberOfPreviousMonthDays = (dayjs(date).date(1).weekday() + 6) % 7;

    for (let i = 0; i < numberOfPreviousMonthDays; i++) {
      console.log('dit is i', dayjs().utc(true));
      daysArray.push(
        dayjs(date)
          .date(1)
          .add(i - numberOfPreviousMonthDays)
      );
    }

    return daysArray;
  }, [date]);

  // const previousMonthDays = React.useMemo(() => {
  //   const numberOfPreviousMonthDays =
  //     (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7;

  //   return Array.from(
  //     {
  //       length: numberOfPreviousMonthDays,
  //     },
  //     (v, i) =>
  //       new Date(
  //         date.getFullYear(),
  //         date.getMonth(),
  //         i - numberOfPreviousMonthDays + 1
  //       )
  //   );
  // }, [date]);

  // const dates = React.useMemo(
  //   () =>
  //     Array.from(
  //       {
  //         length: new Date(
  //           date.getFullYear(),
  //           date.getMonth() + 1,
  //           0
  //         ).getDate(),
  //       },
  //       (v, i) => new Date(date.getFullYear(), date.getMonth(), i + 1)
  //     ),
  //   [date]
  // );

  // const numberOfNextMonthDays = previousMonthDays.length;

  function changeMonthHandler(value: 1 | -1) {
    searchParams.set('d', dayjs(date).add(value, 'month').format('YYYY-MM-DD'));
    submit(
      {},
      {
        action: `${location.pathname}?${searchParams.toString()}`,
      }
    );
  }

  const goToDateHandler = (date: Dayjs) => {
    searchParams.set('d', date.format('YYYY-MM-DD'));
    submit(
      {},
      {
        action: `${location.pathname}?${searchParams.toString()}`,
      }
    );
  };

  return (
    <div className="p-4">
      <div className="p-2 flex justify-center border-2 border-primary">
        {children}
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => goToDateHandler(dayjs(date).add(-1, 'month'))}
          className="btn btn-save"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <p className="text-center font-bold">
          {MONTHS[dayjs(date).month()].name}
        </p>
        <button onClick={() => changeMonthHandler(1)} className="btn btn-save">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      <div className="mt-2 grid grid-cols-7 border-b border-gray-400">
        {WEEKDAYS.map((d) => (
          <p className="text-center" key={d.short}>
            {d}
          </p>
        ))}
      </div>
      <Form
        method="get"
        className="py-2 grid grid-cols-7 border-b border-gray-400"
      >
        {/* {previousMonthDays.map((d, i) => (
          <p className="text-center text-blue-300" key={i}>
            {d.getDate()}
          </p>
        ))} */}
        {days.map((d, i) => (
          <p className="text-center text-blue-300" key={i}>
            {dayjs(d).date()}
          </p>
        ))}
        {/* {dates.map((d, i) => (
          <p
            onClick={() => {
              const sp = new URLSearchParams(location.search);
              sp.set('d', 'hallo');
              console.log(sp.get('d'));
              // submit(
              //   {},
              //   {
              //     action: String(
              //       new URL(`${l.pathname}${l.search}`).searchParams.set(
              //         'd',
              //         'bjorn'
              //       )
              //     ),
              //   }
              // )
            }}
            className={`text-center rounded-full ${
              d.getDate() === date.getDate()
                ? 'border-2 border-red-400'
                : 'hover:bg-primary cursor-pointer '
            }`}
            key={i}
          >
            {d.getDate()}
          </p>
        ))} */}
      </Form>
      <p>{(dayjs(date).date(1).weekday() + 6) % 7}</p>
    </div>
  );
};

export default DateSelector;
