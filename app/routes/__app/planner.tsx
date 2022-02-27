import * as React from 'react';
import { Booking, Schedule, Task, User } from '@prisma/client';
import dayjs from 'dayjs';
import {
  Form,
  Link,
  LoaderFunction,
  redirect,
  useLoaderData,
  useSearchParams,
} from 'remix';
import Container from '~/components/Container';
import PlannerWeekView from '~/components/plannerViews/WeekView';
import PlannerViewToggleButtons, {
  View,
} from '~/components/PlannerViewToggleButtons';
import { getSchedule, getSchedules } from '~/controllers/schedule';
import useDate from '~/hooks/useDate';
import { WEEKDAYS } from '~/utils/date';
import { getBookings } from '~/controllers/booking.server';
import { requireUser } from '~/controllers/auth.server';

var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

type LoaderData = {
  bookings: (Booking & { user: User })[];
  schedule: Schedule & { tasks: Task[] };
  schedules: Schedule[];
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData | Response> => {
  const url = new URL(request.url);

  await requireUser(request, {
    redirectTo: `/auth/login?redirect=${url.pathname}?${url.search}`,
  });

  const bookings = await getBookings();

  const schedule = await getSchedule({
    scheduleId: url.searchParams.get('schedule') ?? '',
  });
  if (!schedule) return redirect('/schedules');

  // const dateParam = url.searchParams.get('d');
  // if (!dateParam || !dayjs(dateParam).isValid()) {
  //   url.searchParams.set('d', dayjs().format('YYYY-MM-DD'));
  //   return redirect(`${url.pathname}${url.search}`);
  // }

  // const viewParam = url.searchParams.get('v');
  // if (!viewParam || !['day', 'week', 'month'].includes(viewParam)) {
  //   url.searchParams.set('v', 'week');
  //   return redirect(`${url.pathname}${url.search}`);
  // }

  const schedules = await getSchedules({});

  return { bookings, schedule, schedules };
};

const Schedule: React.FC<{ date: Date; view: View }> = ({ date, view }) => {
  const { getFirstDayOfTheWeek } = useDate(date);

  return (
    <div>
      <p>{date.toISOString()}</p>
      <p>{getFirstDayOfTheWeek(date).toISOString()}</p>
    </div>
  );
};

export default function Planner() {
  const { bookings, schedule, schedules } = useLoaderData<LoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();

  const view = (searchParams.get('v') ?? 'week') as View;
  const date = new Date(searchParams.get('d') ?? new Date());

  const onDateChangeHandler = (date: string) => {
    // if (dayjs(date, 'DD-MM-YYYY').isValid()) setDate(new Date(date));
  };

  const goToDateHandler = (date2: Date) => {
    // searchParams.set('d', dayjs(date2).format('YYYY-MM-DD'));
    // const params = searchParams.toString();
    // console.log(params);
    // setSearchParams(searchParams);
    // submit(
    //   {},
    //   {
    //     action: `${location.pathname}?${searchParams.toString()}`,
    //   }
    // );
  };

  return (
    <Container>
      <h1>{`Rooster - ${schedule.name}`}</h1>
      <Form>
        <select name="cars">
          {schedules.map((schedule) => (
            <option value={schedule.id} key={schedule.id}>
              {schedule.name}
            </option>
          ))}
        </select>
        {/* <PlannerViewToggleButtons view={view} /> */}
        <PlannerViewToggleButtons />
        <div className="mb-2 flex items-center">
          <button
            onClick={() =>
              goToDateHandler(dayjs(date).subtract(7, 'days').toDate())
            }
            className="btn btn-save"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <p className="mr-2">{WEEKDAYS[date.getDay()].short}</p>
          <input
            type="text"
            defaultValue={dayjs(date).format('DD-MM-YYYY')}
            onChange={(e) => onDateChangeHandler(e.target.value)}
          />
          <button
            onClick={() => goToDateHandler(dayjs(date).add(7, 'days').toDate())}
            className="btn btn-save"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <input
          // value={searchParams.get('d') || ''}
          value={searchParams.toString() || ''}
          onChange={(event) => {
            let filter = event.target.value;
            // if (filter) {
            setSearchParams({ filter });
            // } else {
            //   setSearchParams({});
            // }
          }}
        />
      </Form>
      {view === 'week' ? (
        <PlannerWeekView
          bookings={bookings}
          date={date}
          schedule={schedule}
          tasks={schedule.tasks}
        />
      ) : (
        <Schedule date={new Date(date)} view={'day'} />
      )}
    </Container>
  );
}
