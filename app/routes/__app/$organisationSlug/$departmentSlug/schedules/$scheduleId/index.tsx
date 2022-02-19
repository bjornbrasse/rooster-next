import { Schedule } from '@prisma/client';
import { LoaderFunction, redirect } from 'remix';
import { useLoaderData } from 'remix';
import Container from '~/components/Container';
import { getSchedule } from '~/controllers/schedule';

type LoaderData = {
  schedule: Schedule;
};

export const loader: LoaderFunction = async ({ params }) => {
  const schedule = await getSchedule({ scheduleId: String(params.scheduleId) });

  if (!schedule) return redirect('/');

  return { schedule };
};

export default function Schedule() {
  const { schedule } = useLoaderData<LoaderData>();

  return (
    <Container>
      <h1>Rooster</h1>
      <p>{schedule.name}</p>
    </Container>
  );
}
