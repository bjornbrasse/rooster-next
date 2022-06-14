import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Link, redirect, useLoaderData, useSearchParams } from 'remix';
import { BBHandle, BBLoader } from 'types';
import { DateGrid } from '~/components/date-grid';
import { DateSelector } from '~/components/date-selector';
import { useSchedule } from '~/hooks/useSchedule';
import { requireUserId } from '~/controllers/auth.server';
import { getDepartment } from '~/controllers/department.server';
import { getOrganisation } from '~/controllers/organisation';
import { useDateGrid } from '~/hooks/useDateGrid';
import clsx from 'clsx';
import { db } from '~/utils/db.server';
import { useState } from 'react';
import { usePopper } from 'react-popper';
import { Container } from '~/components/container';

dayjs.extend(customParseFormat);

export const handle: BBHandle = {
  id: 'Bjorn',
  breadcrumb: ({ data }: { data: LoaderData }) => ({
    caption: data.schedule.name,
    href: '/home',
  }),
};

export const getSchedule = async ({
  departmentId,
  scheduleSlug,
}: {
  departmentId: string;
  scheduleSlug: string;
}) => {
  return await db.schedule.findUnique({
    where: { departmentId_slug: { departmentId, slug: scheduleSlug } },
    include: {
      scheduleMembers: { include: { member: true } },
      scheduleTasks: { include: { task: true } },
    },
  });
};

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
    departmentId: department.id,
    scheduleSlug: params.scheduleSlug,
  });
  if (!schedule) return redirect('/s2');

  return { schedule };
};

export default function Schedule() {
  const { schedule } = useLoaderData() as LoaderData;
  const [searchParams] = useSearchParams();

  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>();
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>();

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
  });

  const date = dayjs(searchParams.get('date'), 'YYMMDD').toDate();
  const period = searchParams.get('period');
  const view = searchParams.get('view') as 'person' | 'task';

  const { scheduleDays } = useDateGrid(date, period as 'month' | 'week');

  const { addToSelection } = useSchedule();

  const styles2 = 'border border-gray-400 bg-red-400 p-2 text-lg';

  return (
    <Container padding="p-0" flex="flex-row">
      <div className="grow p-4" id="content">
        <h1>{schedule.name}</h1>
        <button ref={setReferenceElement} type="button">
          <i className="fas fa-cog"></i>
        </button>

        <div
          id="popup"
          ref={setPopperElement}
          style={{ ...styles.popper, backgroundColor: '#6161c6' }}
          {...attributes}
        >
          <h1>Hallo popup</h1>
        </div>

        <div className="my-4 mr-2 flex border-2 border-red-400">
          <Link
            className={clsx(
              styles2,
              {
                'bg-blue-400': period === 'week',
              },
              styles2,
              'rounded-l-md',
            )}
            to={`?date=${dayjs(date).format('YYMMDD')}&period=week`}
            replace
          >
            W
          </Link>
          <Link
            className={clsx(styles2, 'rounded-r-md', {
              'bg-blue-400': period === 'month',
            })}
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

        <div className="border-2 border-blue-400">
          <DateGrid
            activeDate={date}
            bookings={[]}
            onSelect={(taskId: string) => addToSelection({ date })}
            rows={
              view === 'person'
                ? schedule.scheduleMembers.map(({ member }) => ({
                    id: member.id,
                    caption: `${member.firstName} ${member.lastName}`,
                  }))
                : schedule.scheduleTasks.map(({ task }) => ({
                    id: task.id,
                    caption: task.name,
                  }))
            }
            schedule={schedule}
            startDate={dayjs()
              .startOf('month')
              .startOf('week')
              .add(1, 'day')
              .toDate()}
            endDate={dayjs()
              .endOf('month')
              .endOf('week')
              .add(1, 'day')
              .toDate()}
            view={view}
            key={`${view} - ${date}`}
          />
        </div>
      </div>
      <div className="w-72 border border-red-400 bg-stone-200 p-4 lg:w-1/4">
        <DateSelector date={date} />
      </div>
    </Container>
  );
}
