import { Schedule } from "@prisma/client";
import {
  LoaderFunction,
  redirect,
  useLoaderData,
  useSearchParams,
} from "remix";
import { getSchedule } from "~/controllers/schedule.server";

import dayjs, { Dayjs } from "dayjs";
import weekYear from "dayjs/plugin/weekYear"; // dependent on weekOfYear plugin
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekday from "dayjs/plugin/weekday";
import PlannerViewToggleButtons, {
  View,
} from "~/components/PlannerViewToggleButtons";
import DateSelector from "~/components/DateSelector";

dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(weekday);

type LoaderData = {
  date: Dayjs;
  schedule: Schedule;
  view: View;
};

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData | Response> => {
  const url = new URL(request.url);

  const date = dayjs(url.searchParams.get("d"));
  // if (!date) {
  //   url.searchParams.set('d', dayjs().format('YYYY-MM-DD'));
  //   return redirect(`${url.pathname}${url.search}`);
  // }

  const view = url.searchParams.get("v") as View;
  if (!view || !["day", "week", "month"].includes(view)) {
    url.searchParams.set("v", "week");
    return redirect(`${url.pathname}${url.search}`);
  }

  const schedule = await getSchedule({
    scheduleId: String(url.searchParams.get("schedule")),
  });
  if (!schedule) return redirect(`/${params.organisationSlug}`);

  return { date: date ?? dayjs(), schedule, view };
};

export default function Planner() {
  // const [date, setDate] = React.useState(new Date());
  const { date, schedule, view } = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();

  // const date = new Date(String(searchParams.get('d')));
  // const date = new Date(dateDJS.toString());

  return (
    <div className="h-full flex border-4 border-sky-500">
      <div className="w-1/5 border-r border-primary">
        <DateSelector date={date}>
          <PlannerViewToggleButtons view={view} />
        </DateSelector>
      </div>
      <div className="flex-grow border-4 border-fuchsia-400">
        <p>{schedule.name}</p>
        {/* <p>Huidige datum: {date.toISOString()}</p> */}
        {/* <p>
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
          <p>Weekday: {dayjs(date).daysInMonth()}</p>
          <p>Volgende maand: {}</p>
        </p> */}
      </div>
    </div>
  );
}
