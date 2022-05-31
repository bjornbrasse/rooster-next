import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { SetStateAction } from 'react';
import { redirect, useLoaderData, useSearchParams } from 'remix';
import { BBLoader } from 'types';
import { DateSelector } from '~/components/date-selector';
import { WeekPlanner } from '~/components/planners/week-planner';
import { requireUserId } from '~/controllers/auth.server';
import { getDepartment } from '~/controllers/department.server';
import { getOrganisation } from '~/controllers/organisation';
import { getSchedule } from '~/controllers/schedule.server';

dayjs.extend(customParseFormat);

type LoaderData = {
  schedule: Exclude<Awaited<ReturnType<typeof getSchedule>>, null>;
};

export const loader: BBLoader<{
  departmentSlug: string;
  organisationSlug: string;
  scheduleSlug: string;
}> = async ({ request, params }) => {
  await requireUserId(request);

  const url = new URL(request.url);
  const date = url.searchParams.get('date');
  if (!date) {
    url.searchParams.set('date', dayjs().format('YYMMDD'));
    return redirect(url.toString());
  }

  const organisation = await getOrganisation({ slug: params.organisationSlug });
  if (!organisation) return redirect('/organisations');

  const department = await getDepartment({
    organisationId_slug: {
      organisationId: organisation.id,
      slug: params.departmentSlug,
    },
  });
  if (!department) return redirect('/s');

  const schedule = await getSchedule({
    departmentId_slug: {
      departmentId: department.id,
      slug: params.scheduleSlug,
    },
  });
  if (!schedule) return redirect('/s2');

  return { schedule };
};

export default function Planner() {
  const { schedule } = useLoaderData() as LoaderData;
  const [searchParams] = useSearchParams();
  const date = dayjs(searchParams.get('date'), 'YYMMDD').toDate();

  return (
    <div className="flex h-full">
      <div className="flex-1 p-4">
        <h1>Hoi</h1>
        <p>{schedule.name}</p>
        <WeekPlanner bookings={[]} date={date} schedule={schedule} />
      </div>
      <div className="w-72 border border-red-400 bg-stone-200 p-4 lg:w-1/4">
        <DateSelector
          date={date}
          setDate={function (value: SetStateAction<Date>): void {
            throw new Error('Function not implemented.');
          }}
        />
      </div>
    </div>
  );
}
