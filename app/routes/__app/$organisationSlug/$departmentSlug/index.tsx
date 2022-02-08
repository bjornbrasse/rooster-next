import { Department, Schedule } from '@prisma/client';
import { Link, LoaderFunction, redirect, useFetcher, useFetchers } from 'remix';
import { useLoaderData } from 'remix';
import ScheduleForm from '~/components/forms/ScheduleForm';
import { useDialog } from '~/contexts/dialog';
import { getDepartment } from '~/controllers/department';
import { getSchedules } from '~/controllers/schedule';

type LoaderData = {
  department: Department;
  schedules: Schedule[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const department = await getDepartment({
    departmentSlug: String(params.departmentSlug),
  });

  if (!department) return redirect('/');

  const schedules = await getSchedules({ departmentId: department?.id });

  return { department, schedules };
};

function ScheduleItem({ schedule }: { schedule: Schedule }) {
  const { Form } = useFetcher();
  return (
    <Link to={`planner?schedule=${schedule.id}`} className="flex">
      <p>{schedule.name}</p>
      <Form method="post" action="/_api/schedule">
        <button type="submit">
          <i className="fas fa-minus"></i>
        </button>
      </Form>
    </Link>
  );
}

export default function Department() {
  const { department, schedules } = useLoaderData<LoaderData>();
  const { openDialog, closeDialog } = useDialog();

  function addScheduleHandler() {
    openDialog(
      'Maak een rooster aan',
      <ScheduleForm departmentId={department.id} onSaved={closeDialog} />
    );
  }

  return (
    <div className="h-full p-12">
      <div className="flex justify-between">
        <h1>Afdeling 2 - {department.name}</h1>
        <button className="btn btn-save" onClick={addScheduleHandler}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <p>Schedules</p>
      {schedules.map((schedule) => (
        <ScheduleItem schedule={schedule} key={schedule.id} />
      ))}
    </div>
  );
}
