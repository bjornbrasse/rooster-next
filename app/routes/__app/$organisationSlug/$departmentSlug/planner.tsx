import * as React from 'react';
import { Schedule } from '@prisma/client';
import {
  Form,
  LoaderFunction,
  redirect,
  useLoaderData,
  useLocation,
  useSearchParams,
  useSubmit,
} from 'remix';
import { getSchedule } from '~/controllers/schedule';
import { MONTHS, WEEKDAYS } from '~/utils/date';

type LoaderData = {
  schedule: Schedule;
};

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData | Response> => {
  const url = new URL(request.url);
  const schedule = await getSchedule({
    scheduleId: String(url.searchParams.get('schedule')),
  });

  if (!schedule) return redirect(`/${params.organisationSlug}`);

  return { schedule };
};

function MonthView({ date = new Date() }: { date: Date }) {
  const submit = useSubmit();
  const { search: searchParams } = useLocation();

  const previousMonthDays = React.useMemo(() => {
    const numberOfPreviousMonthDays =
      (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7;

    return Array.from(
      {
        length: numberOfPreviousMonthDays,
      },
      (v, i) =>
        new Date(
          date.getFullYear(),
          date.getMonth(),
          i - numberOfPreviousMonthDays + 1
        )
    );
  }, [date]);

  const dates = React.useMemo(
    () =>
      Array.from(
        {
          length: new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
          ).getDate(),
        },
        (v, i) => new Date(date.getFullYear(), date.getMonth(), i + 1)
      ),
    [date]
  );

  const numberOfNextMonthDays = previousMonthDays.length;

  function changeMonthHandler(direction: 1 | -1) {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('d', 'bjorn');
    console.log(searchParams.get('d'));
  }

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <button onClick={() => changeMonthHandler(1)} className="btn btn-save">
          <i className="fas fa-chevron-left"></i>
        </button>
        <p className="text-center font-bold">{MONTHS[date.getMonth()].name}</p>
        <button className="btn btn-save">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      <div className="mt-2 grid grid-cols-7 border-b border-gray-400">
        {WEEKDAYS.map((d) => (
          <p className="text-center" key={d}>
            {d}
          </p>
        ))}
      </div>
      <Form
        method="get"
        className="py-2 grid grid-cols-7 border-b border-gray-400"
      >
        {previousMonthDays.map((d, i) => (
          <p className="text-center text-blue-300" key={i}>
            {d.getDate()}
          </p>
        ))}
        {dates.map((d, i) => (
          <p
            onClick={() => {
              const sp = new URLSearchParams(searchParams);
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
        ))}
      </Form>
    </div>
  );
}

export default function Planner() {
  // const [date, setDate] = React.useState(new Date());
  const { schedule } = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();

  const date = new Date(String(searchParams.get('d')));

  return (
    <div className="h-full flex border-4 border-sky-500">
      <div className="w-1/5 border-r border-primary">
        <MonthView date={date} />
      </div>
      <div className="flex-grow border-4 border-fuchsia-400">
        <p>{schedule.name}</p>
        <p>Huidige datum: {date.toISOString()}</p>
        <p>
          Dagen in maand:{' '}
          {new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()}
        </p>
        <p>
          Probeer:{' '}
          {(new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7}
          Test:{' '}
          {new Date(
            date.getFullYear(),
            date.getMonth(),
            1 -
              ((new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) %
                7)
          ).getDate()}
        </p>
      </div>
    </div>
  );
}
