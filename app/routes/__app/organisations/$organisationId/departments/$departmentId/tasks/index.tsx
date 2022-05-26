import { Link, LoaderFunction, Outlet, useLoaderData } from 'remix';
import { BBLoader } from 'types';
import { ColumnLookupView } from '~/components/column-lookp-view';
import { getTasks } from '~/controllers/task.server';

type LoaderData = {
  tasks: Awaited<ReturnType<typeof getTasks>>;
};

// export const loader: BBLoader<{ departmentId: string }> = async ({
//   params,
// }): Promise<LoaderData> => {
//   const tasks = await getTasks({ departmentId: params.departmentId as string });

//   return { tasks };
// };

export default function DepartmentTasks() {
  // const { tasks } = useLoaderData() as LoaderData;

  return (
    <div>
      <p>Afdelings Taak</p>
    </div>
  );
}
