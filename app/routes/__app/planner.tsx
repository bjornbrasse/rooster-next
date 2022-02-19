import dayjs from 'dayjs';
import * as React from 'react';
import { Form, LoaderFunction, redirect, useLoaderData } from 'remix';
import Container from '~/components/Container';
import PlannerViewToggleButtons, {
  View,
} from '~/components/PlannerViewToggleButtons';
import useDate from '~/hooks/useDate';
import { WEEKDAYS } from '~/utils/date';

var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

type LoaderData = {
  date: Date;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData | Response> => {
  const url = new URL(request.url);

  // if (!view || !['day', 'week', 'month'].includes(view)) {
  //   url.searchParams.set('v', 'week');
  //   return redirect(`${url.pathname}${url.search}`);
  // }

  const dateParam = url.searchParams.get('d');
  if (!dateParam || !dayjs(dateParam).isValid()) {
    url.searchParams.set('d', dayjs().format('YYYY-MM-DD'));
    return redirect(`${url.pathname}${url.search}`);
  }

  return { date: new Date(dateParam) };
};

const Schedule: React.FC<{ date: Date; view: View }> = ({ date, view }) => {
  const { getFirstDayOfTheWeek } = useDate();

  return (
    <div>
      <h3>Schedule</h3>
      <p>{date.toISOString()}</p>
      <p>{getFirstDayOfTheWeek(date).toISOString()}</p>
    </div>
  );
};

export default function Planner() {
  const { date } = useLoaderData<LoaderData>();
  const [view, setView] = React.useState<View>('week');

  const onDateChangeHandler = (date: string) => {
    // if (dayjs(date, 'DD-MM-YYYY').isValid()) setDate(new Date(date));
  };

  return (
    <Container>
      <h1>Planner</h1>
      <Form>
        <PlannerViewToggleButtons view={view} />
        <div className="mb-2 flex items-center">
          {/* <p className="mr-2">{WEEKDAYS[date.getDay()]}</p> */}
          <input
            type="text"
            defaultValue={dayjs(date).format('DD-MM-YYYY')}
            onChange={(e) => onDateChangeHandler(e.target.value)}
          />
        </div>
      </Form>
      <Schedule date={new Date(date)} view={'day'} />
    </Container>
  );
}
