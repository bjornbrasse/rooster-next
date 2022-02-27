import { Schedule } from '@prisma/client';
import dayjs from 'dayjs';
import { Link, LoaderFunction, useLoaderData } from 'remix';
import { getSchedules } from '~/controllers/schedule';

type LoaderData = {
  schedules: Schedule[];
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const schedules = await getSchedules({});

  return { schedules };
};

export default function Schedules() {
  const { schedules } = useLoaderData<LoaderData>();

  return (
    <div className="m-8">
      <h1>Roosters</h1>
      <ul className="mt-4">
        {schedules.map((schedule) => (
          <li key={schedule.id}>
            <Link
              to={`/planner?schedule=${schedule.id}&d=${dayjs().format(
                'YYYY-MM-DD'
              )}&v=week`}
              className="text-blue-600 underline"
            >
              {schedule.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
