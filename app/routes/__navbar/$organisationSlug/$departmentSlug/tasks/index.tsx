import { useLoaderData } from 'remix';
import { BBLoader } from 'types';
import { Container } from '~/components/container';
import { useDialog } from '~/contexts/dialog';
import { db } from '~/utils/db.server';

const getTasks = async ({
  departmentSlug: slug,
}: {
  departmentSlug: string;
}) => {
  return await db.task.findMany({
    where: { department: { slug } },
  });
};

type LoaderData = {
  tasks: Awaited<ReturnType<typeof getTasks>>;
};

export const loader: BBLoader<{ departmentSlug: string }> = async ({
  params: { departmentSlug },
}) => {
  const tasks = await getTasks({ departmentSlug });

  return { tasks };
};

export default function DepartmentTasks() {
  const { closeDialog, openDialog } = useDialog();
  const { tasks } = useLoaderData() as LoaderData;

  return (
    <Container>
      <h1>Taken</h1>
      <table>
        <thead>
          <tr>
            <th>Taak</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}
