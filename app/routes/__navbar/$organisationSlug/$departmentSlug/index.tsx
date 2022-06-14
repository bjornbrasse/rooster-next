import { Schedule, Task } from '@prisma/client';
import { useState } from 'react';
import { json, Link, MetaFunction, useFetcher } from 'remix';
import { useLoaderData } from 'remix';
import { redirect } from 'remix';
import { BBHandle, BBLoader, Breadcrumb, LoaderDataBase } from 'types';
import { Container } from '~/components/container';
import { DraggableListItem } from '~/components/dragable-list-item';
import ScheduleForm from '~/components/forms/schedule-form';
import TaskForm from '~/components/forms/task-form';
import { Frame } from '~/components/frame';
import { useDialog } from '~/contexts/dialog';
import { requireUserId } from '~/controllers/auth.server';
import { db } from '~/utils/db.server';
import { DnDItemTypes } from '~/utils/dnd';

export const meta: MetaFunction = ({ data }) => ({
  title: data.department.name,
});

export const handle: BBHandle = {
  id: 'DepartmentPage',
  breadcrumb: ({ data }: { data: LoaderData }) => ({
    caption: data?.department.name ?? 'Afdeling',
    href: `/${data?.department.organisation.slug ?? 'Organisatie'}`,
  }),
};

async function getDepartment(organisationId_slug: {
  organisationId: string;
  slug: string;
}) {
  return await db.department.findUnique({
    where: { organisationId_slug },
    include: { organisation: true },
  });
}

const getOrganisation = async (organisationSlug: string) => {
  return await db.organisation.findUnique({
    where: { slug: organisationSlug },
  });
};

const getDepartmentTasks = async ({
  departmentId,
}: {
  departmentId: string;
}) => {
  return await db.task.findMany({
    where: { departmentId },
  });
};

export type LoaderData = LoaderDataBase & {
  department: Exclude<Awaited<ReturnType<typeof getDepartment>>, null>;
  departmentTasks: Awaited<ReturnType<typeof getDepartmentTasks>>;
  organisation: Exclude<Awaited<ReturnType<typeof getOrganisation>>, null>;
};

export const loader: BBLoader<{
  departmentSlug: string;
  organisationSlug: string;
}> = async ({ params: { departmentSlug, organisationSlug }, request }) => {
  await requireUserId(request);

  const organisation = await getOrganisation(organisationSlug);

  if (!organisation) {
    return redirect('/home');
  }

  const department = await getDepartment({
    organisationId: organisation?.id ?? '',
    slug: departmentSlug,
  });

  if (!department) {
    return redirect('/home');
  }

  const departmentTasks = await getDepartmentTasks({
    departmentId: department.id,
  });

  return json<LoaderData>({ department, departmentTasks, organisation });
};

export default function DepartmentPage() {
  const { department, departmentTasks, organisation } =
    useLoaderData() as LoaderData;
  const { closeDialog, openDialog } = useDialog();
  const [isEditingEmployees, setIsEditingEmployees] = useState(false);
  const fetcher = useFetcher();

  return (
    <div className="flex h-full">
      <Container>
        <div id="content" className="flex flex-col space-y-4 px-24">
          <Frame
            buttons={
              <button
                onClick={() =>
                  openDialog(
                    'Nieuwe Taak',
                    <TaskForm
                      onSaved={(task: Task) => {
                        closeDialog();
                      }}
                      departmentId={department.id}
                    />,
                    'Maak een nieuwe taak aan',
                  )
                }
              >
                <i className="fas fa-plus"></i>
              </button>
            }
            title="Taken"
          >
            {departmentTasks.map((task) => (
              <div
                className="cursor-pointer px-1 hover:bg-blue-300"
                key={task.id}
                onClick={() =>
                  openDialog(
                    'Taak bewerken',
                    <TaskForm
                      onSaved={(task: Task) => {
                        console.log('werkt dit?');
                        closeDialog();
                      }}
                      task={task}
                    />,
                  )
                }
              >
                {task.name}
              </div>
            ))}
          </Frame>
          {/* <Frame
            buttons={
              <button
                onClick={() =>
                  openDialog(
                    'Nieuw Rooster',
                    <ScheduleForm
                      onSaved={(schedule: Schedule) => {
                        closeDialog();
                      }}
                      departmentId={department.id}
                    />,
                    'Maak een nieuw rooster aan.',
                  )
                }
              >
                <i className="fas fa-plus"></i>
              </button>
            }
            title="Roosters"
          >
            {department.schedules.map((schedule) => (
              <Link to={`/schedules/${schedule.id}`} key={schedule.id}>
                {schedule.name}
              </Link>
            ))}
          </Frame> */}
        </div>
      </Container>
    </div>
  );
}
