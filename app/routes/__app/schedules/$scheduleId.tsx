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
import { getSchedule } from '~/controllers/schedule';

type LoaderData = {
  schedule: Schedule & {
    department: Department & {
      employees: (DepartmentEmployee & { user: User })[];
    };
    members: (ScheduleMember & { user: User })[];
    tasks: Task[];
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const schedule = await getSchedule({ scheduleId: String(params.scheduleId) });

  if (!schedule) return redirect('/schedules');

  return { schedule };
};

export default function Schedule() {
  const { openDialog } = useDialog();
  const { schedule } = useLoaderData<LoaderData>();

  return (
    <Container>
      <div className="mb-4">
        <h1>{schedule.name}</h1>
        <Link
          to={`/departments/${schedule.departmentId}`}
          className="text-gray-500 hover:text-blue-600 underline decoration-solid"
        >
          {schedule.department.name}
        </Link>
      </div>
      <div className="px-2 py-1 bg-gray-200 flex justify-between">
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
              />
            )
          }
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <div className="px-1.5 mb-2">
        {schedule.members
          .sort(({ user: a }, { user: b }) =>
            a.lastName < b.lastName ? -1 : 0
          )
          .map(({ user }) => (
            <div key={user.id}>{user.lastName}</div>
          ))}
      </div>
      <div className="px-2 py-1 bg-gray-200 flex justify-between">
        <h2>Taken</h2>
        <button
          onClick={() =>
            openDialog(
              'Nieuwe taak',
              <TaskForm
                onSaved={function (task: Task): void {
                  throw new Error('Function not implemented.');
                }}
                redirectTo={''}
                scheduleId={schedule.id}
              />
            )
          }
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <div className="px-1.5">
        {schedule.tasks.map((task) => (
          <div key={task.id}>{task.name}</div>
        ))}
      </div>
    </Container>
  );
}
