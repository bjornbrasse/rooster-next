import { Schedule } from '@prisma/client';
import {
  Link,
  LoaderFunction,
  useFetcher,
  useLoaderData,
  useParams,
} from 'remix';
import { Container } from '~/components/container';
import DialogButton from '~/components/DialogButton';
import ScheduleForm from '~/components/forms/ScheduleForm';
import { getSchedules } from '~/controllers/schedule.server';

type LoaderData = {
  schedules: Schedule[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const schedules = await getSchedules({
    departmentId: String(params.departmentId),
  });

  return { schedules };
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
  const { schedules } = useLoaderData<LoaderData>();
  const { departmentId } = useParams();

  return (
    <Container flex={'col'}>
      {schedules.map((schedule) => (
        <ScheduleItem schedule={schedule} key={schedule.id} />
      ))}
    </Container>
  );
}
