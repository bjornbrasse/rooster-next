import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { SetStateAction, useEffect, useMemo } from 'react';
import { Form, Link, redirect, useLoaderData, useSearchParams } from 'remix';
import { BBLoader } from 'types';
import { DateGrid } from '~/components/date-grid';
import { DateSelector } from '~/components/date-selector';
import { useSchedule } from '~/hooks/useSchedule';
import { requireUserId } from '~/controllers/auth.server';
import { getDepartment } from '~/controllers/department.server';
import { getOrganisation } from '~/controllers/organisation';
import { getSchedule } from '~/controllers/schedule.server';
import { useDateGrid } from '~/hooks/useDateGrid';
import clsx from 'clsx';

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

  const period = url.searchParams.get('period');
  if (!period) {
    url.searchParams.set('period', 'month');
    return redirect(url.toString());
  }

  const view = url.searchParams.get('view');
  if (!view) {
    url.searchParams.set('view', 'task');
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
  const period = searchParams.get('period');
  const view = searchParams.get('view');

  const { scheduleDays } = useDateGrid(date, period as 'month' | 'week');

  const { addToSelection } = useSchedule();

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-hidden p-4">
        <h1>{schedule.name}</h1>

        <div className="my-4 mr-2 inline-block border-2 border-red-400">
          <Link
            className={clsx({ 'bg-blue-400': period === 'week' })}
            to={`?date=${dayjs(date).format('YYMMDD')}&period=week`}
            replace
          >
            W
          </Link>
          <Link
            className={clsx({ 'bg-blue-400': period === 'month' })}
            to={`?date=${dayjs(date).format('YYMMDD')}&period=month`}
            replace
          >
            M
          </Link>
        </div>
        <div className="inline-block border-2 border-red-400">
          <Link
            className={clsx({ 'bg-blue-400': view === 'task' })}
            to={`?date=${dayjs(date).format('YYMMDD')}&view=task`}
            replace
          >
            T
          </Link>
          <Link
            className={clsx({ 'bg-blue-400': view === 'person' })}
            to={`?date=${dayjs(date).format('YYMMDD')}&view=person`}
            replace
          >
            P
          </Link>
        </div>

        <div className="relative overflow-x-auto border-2 border-blue-400">
          <DateGrid
            activeDate={date}
            bookings={[]}
            dates={scheduleDays}
            onSelect={(taskId: string) => addToSelection({ date })}
            rows={
              view === 'person'
                ? schedule.scheduleMembers.map(({ user }) => ({
                    id: user.id,
                    caption: `${user.firstName} ${user.lastName}`,
                  }))
                : schedule.scheduleTasks.map(({ task }) => ({
                    id: task.id,
                    caption: task.name,
                  }))
            }
            schedule={schedule}
            view={view}
            key={`${view} - ${date}`}
          />
        </div>
      </div>
      <div className="w-72 border border-red-400 bg-stone-200 p-4 lg:w-1/4">
        <DateSelector date={date} />
      </div>
    </div>
  );
}
