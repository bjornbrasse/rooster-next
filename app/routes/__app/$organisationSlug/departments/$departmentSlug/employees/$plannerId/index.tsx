import type { LoaderFunction } from 'remix';
import { useLoaderData } from 'remix';

export let loader: LoaderFunction = async ({ request }) => {
  let url = new URL(request.url);
  let term = url.searchParams.get('d');

  return { term };
};

export default function Planner() {
  const days = [...Array(31).keys()].map((i) => i + 1);
  const { term } = useLoaderData();

  const date = new Date('2021-07-31');
  date.setMonth(date.getMonth() + 7);

  return (
    <div>
      <h1>Tof</h1>
      <p>{date.toISOString()}</p>
      <div className="flex">
        {days.map((d) => (
          <div className="w-8 text-center border border-gray-200">{d}</div>
        ))}
      </div>
    </div>
  );
}
