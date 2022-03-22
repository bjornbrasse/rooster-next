import {
  Department,
  DepartmentEmployee,
  Schedule,
  ScheduleMember,
  Task,
  User,
} from '@prisma/client';
import { Link, LoaderFunction, redirect, useLoaderData } from 'remix';
import Container from '~/components/Container';
import MemberForm from '~/components/forms/MemberForm';
import TaskForm from '~/components/forms/TaskForm';
import { useDialog } from '~/contexts/dialog';
import { getSchedule } from '~/controllers/schedule.server';

type LoaderData = {
  schedule: Awaited<ReturnType<typeof getSchedule>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const schedule = await getSchedule({ scheduleId: String(params.scheduleId) });

  if (!schedule) return redirect('/schedules');

  return { schedule };
};

export default function Schedule() {
  const { schedule } = useLoaderData() as LoaderData;
  const { openDialog } = useDialog();

  const { department, scheduleMembers, scheduleTasks } = schedule;

  return (
    <Container>
      <div className="mb-4">
        <h1>{schedule.name}</h1>
        <Link
          to={`/departments/${schedule.departmentId}`}
          className="text-gray-500 underline decoration-solid hover:text-blue-600"
        >
          {schedule.department.name}
        </Link>
      </div>
      <div className="flex justify-between bg-gray-200 px-2 py-1">
        <h2>Leden</h2>
        <button
          onClick={() =>
            openDialog(
              'Gebruiker als lid toevoegen',
              <MemberForm
                onSaved={function (task: Task): void {
                  throw new Error('Function not implemented.');
                }}
                redirectTo={''}
                scheduleId={schedule.id}
                departmentEmployees={schedule.department.employees.map((e) => ({
                  ...e.user,
                }))}
              />,
            )
          }
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <div className="mb-2 px-1.5">
        {scheduleMembers
          .sort(({ user: a }, { user: b }) =>
            a.lastName < b.lastName ? -1 : 0,
          )
          .map(({ user }) => (
            <div key={user.id}>{user.lastName}</div>
          ))}
      </div>
      <div className="flex justify-between bg-gray-200 px-2 py-1">
        <h2>Taken</h2>
        <button
          onClick={
            () => console.log('nog aanpassen, taak hoort bij department!')
            // openDialog(
            //   "Nieuwe taak",
            //   <TaskForm
            //     onSaved={function (task: Task): void {
            //       throw new Error("Function not implemented.");
            //     }}
            //     redirectTo={""}
            //     scheduleId={schedule.id}
            //   />
            // )
          }
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <div className="px-1.5">
        {scheduleTasks.map(({ task }) => (
          <div key={task.id}>{task.name}</div>
        ))}
      </div>
      <div className="border-2 border-red-500">
        <p>Taken Afdeling</p>
        {department.tasks.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </div>
    </Container>
  );
}
