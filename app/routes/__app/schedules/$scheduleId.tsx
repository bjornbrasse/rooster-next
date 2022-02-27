import { Schedule, Task } from '@prisma/client';
import { LoaderFunction, redirect, useLoaderData } from 'remix';
import Container from '~/components/Container';
import TaskForm from '~/components/forms/TaskForm';
import { useDialog } from '~/contexts/dialog';
import { getSchedule } from '~/controllers/schedule';

type LoaderData = {
  schedule: Schedule & {
    tasks: Task[];
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const schedule = await getSchedule({ scheduleId: String(params.scheduleId) });

  if (!schedule) return redirect('/');

  return { schedule };
};

export default function Schedule() {
  const { openDialog } = useDialog();
  const { schedule } = useLoaderData<LoaderData>();

  return (
    <Container>
      <h1>Schedule</h1>
      <p>{schedule.name}</p>
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
