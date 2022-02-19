import { Department, Schedule } from '@prisma/client';
import {
  Link,
  LoaderFunction,
  useFetcher,
  useLoaderData,
  useMatches,
  useParams,
} from 'remix';
import { redirect } from 'remix';
import Container from '~/components/Container';
import ScheduleForm from '~/components/forms/ScheduleForm';
import { useDialog } from '~/contexts/dialog';
import { getDepartment } from '~/controllers/department';
import { getSchedules } from '~/controllers/schedule';
import department from '~/routes/_api/department';

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
    <Link to={`${schedule.id}`} className="flex">
      <p>{schedule.name}</p>
      <Form method="post" action="/_api/schedule">
        <button type="submit">
          <i className="fas fa-minus"></i>
        </button>
      </Form>
    </Link>
  );
}

export default function Schedules() {
  const { department, schedules } = useLoaderData<LoaderData>();

  const { openDialog, closeDialog } = useDialog();

  function addScheduleHandler() {
    openDialog(
      'Maak een rooster aan',
      <ScheduleForm departmentId={department.id} onSaved={closeDialog} />
    );
  }

  return (
    <Container flex={'col'}>
      <h1>Roosters</h1>

      <div className="flex justify-between">
        <button className="btn btn-save" onClick={addScheduleHandler}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <p>Schedules</p>
      {schedules.map((schedule) => (
        <ScheduleItem schedule={schedule} key={schedule.id} />
      ))}
    </Container>
  );
}
