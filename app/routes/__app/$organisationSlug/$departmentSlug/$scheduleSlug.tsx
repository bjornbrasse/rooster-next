import { redirect, useLoaderData } from 'remix';
import { BBLoader } from 'types';
import { requireUserId } from '~/controllers/auth.server';
import { getDepartment } from '~/controllers/department.server';
import { getOrganisation } from '~/controllers/organisation';
import { getSchedule } from '~/controllers/schedule.server';

type LoaderData = {
  schedule: Exclude<Awaited<ReturnType<typeof getSchedule>>, null>;
};

export const loader: BBLoader<{
  departmentSlug: string;
  organisationSlug: string;
  scheduleSlug: string;
}> = async ({ request, params }) => {
  const userId = await requireUserId(request);

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

  return (
    <div>
      <h1>Hoi</h1>
      <p>{schedule.name}</p>
      <div>
        {schedule.scheduleTasks.map(({ task }) => (
          <div key={task.id}>{task.name}</div>
        ))}
      </div>
    </div>
  );
}
