import { Department, Organisation, Task, User } from '@prisma/client';
import { Link, LoaderFunction, MetaFunction } from 'remix';
import { useLoaderData, useLocation } from 'remix';
import { redirect } from 'remix';
import { Outlet, useParams } from 'remix';
import { BBHandle, BBLoader, Breadcrumb, LoaderDataBase } from 'types';
import DialogButton from '~/components/DialogButton';
import ScheduleForm from '~/components/forms/ScheduleForm';
import TaskForm from '~/components/forms/task-form';
import { UserForm } from '~/components/forms/user-form';
import { Frame } from '~/components/frame';
import { Header } from '~/components/header';
import Navigator from '~/components/Navigator';
import Tabs from '~/components/Tabs';
import { useDialog } from '~/contexts/dialog';
import { requireUser, requireUserId } from '~/controllers/auth.server';
import { getDepartment, getDepartmentEmployee } from '~/controllers/department';
import useLocalStorage from '~/hooks/useLocalStorage';
import DepartmentCreate from './create';

export const meta: MetaFunction = ({ data }) => {
  return { title: data.department.name };
};

export const handle: BBHandle = {
  id: 'Bjorn',
};

type LoaderData = LoaderDataBase & {
  department: Exclude<Awaited<ReturnType<typeof getDepartment>>, null>;
  departmentEmployee: Awaited<ReturnType<typeof getDepartmentEmployee>>;
};

export const loader: BBLoader<{ departmentId: string }> = async ({
  params: { departmentId },
  request,
}) => {
  const userId = await requireUserId(request);

  const department = await getDepartment({ id: departmentId, userId });

  if (!department) {
    return redirect('/home');
  }

  // const departmentEmployee = await getDepartmentEmployee({
  //   departmentId,
  //   userId,
  // });

  // const breadcrumbs: Breadcrumb[] = [
  //   {
  //     caption: department.organisation.name,
  //     to: `/organisations/${department.organisation.id}`,
  //   },
  //   {
  //     caption: department.name,
  //     to: `/departments/${department.id}`,
  //   },
  // ];

  // return { breadcrumbs, department, departmentEmployee };
  return { department };
};

export default function DepartmentLayout() {
  const { department } = useLoaderData() as LoaderData;
  const { closeDialog, openDialog } = useDialog();
  const [prevDepartmentTaskId] = useLocalStorage(
    'prev-department-task-id',
    null,
  );

  return (
    <div className="flex h-full w-full flex-col border-4 border-red-600 p-4">
      <Header>
        <Link to="/organisations" className="mr-1 flex space-x-2">
          <i className="fas fa-angle-left"></i>
          <i className="fas fa-building"></i>
        </Link>
        <Link to={`/organisations/${department.organisationId}`}>
          {department.organisation.name}
        </Link>
        <i className="fas fa-angle-right"></i>
        <p>{department.name}</p>
      </Header>
      <div id="content" className="flex flex-col space-y-4 px-24">
        <Frame title="Medewerkers"></Frame>
        <Frame
          buttons={
            <button
              onClick={() =>
                openDialog(
                  'Nieuwe Taak',
                  <TaskForm
                    onSaved={function (task: Task): void {
                      throw new Error('Function not implemented.');
                    }}
                    departmentId={department.id}
                  />,
                  'Maak een nieuwe taak aan',
                )
              }
            >
              <i className="fas fa-plus"></i>
            </button>
          }
          title="Taken"
        >
          {department.tasks.map((task) => (
            <div>{task.name}</div>
          ))}
        </Frame>
      </div>
    </div>
  );
}
