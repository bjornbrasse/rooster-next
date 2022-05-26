import { Department, Organisation, Task, User } from '@prisma/client';
import { Link, LoaderFunction, MetaFunction } from 'remix';
import { useLoaderData, useLocation } from 'remix';
import { redirect } from 'remix';
import { Outlet, useParams } from 'remix';
import { BBHandle, BBLoader, Breadcrumb, LoaderDataBase } from 'types';
import DialogButton from '~/components/DialogButton';
import ScheduleForm from '~/components/forms/ScheduleForm';
import TaskForm from '~/components/forms/TaskForm';
import { UserForm } from '~/components/forms/user-form';
import Navigator from '~/components/Navigator';
import Tabs from '~/components/Tabs';
import { useDialog } from '~/contexts/dialog';
import { requireUser } from '~/controllers/auth.server';
import { getDepartment, getDepartmentEmployee } from '~/controllers/department';
import useLocalStorage from '~/hooks/useLocalStorage';

export const meta: MetaFunction = ({ data }) => {
  return { title: data.department.name };
};

export const handle: BBHandle = {
  id: 'Bjorn',
};

type LoaderData = LoaderDataBase & {
  department: Awaited<ReturnType<typeof getDepartment>>;
  departmentEmployee: Awaited<ReturnType<typeof getDepartmentEmployee>>;
};

export const loader: BBLoader<{ departmentId: string }> = async ({
  params: { departmentId },
  request,
}): Promise<LoaderData | Response> => {
  const user = await requireUser(request);

  const department = await getDepartment({ departmentId });

  const departmentEmployee = await getDepartmentEmployee({
    departmentId,
    userId: user.id,
  });

  const breadcrumbs: Breadcrumb[] = [
    {
      caption: department.organisation.name,
      to: `/organisations/${department.organisation.id}`,
    },
    {
      caption: department.name,
      to: `/departments/${department.id}`,
    },
  ];

  return { breadcrumbs, department, departmentEmployee };
};

export default function DepartmentLayout() {
  const { department, departmentEmployee } = useLoaderData() as LoaderData;
  const location = useLocation();
  const { departmentId, employeeId, taskId } = useParams();
  const { closeDialog } = useDialog();
  const [prevDepartmentTaskId] = useLocalStorage(
    'prev-department-task-id',
    null,
  );

  return (
    <div className="flex w-full flex-col">
      <Navigator
        organisation={department.organisation}
        organisationTo={`/organisations/${department.organisation.id}${
          location.pathname.includes('tasks') ? '?redirectTo=tasks' : null
        }`}
        department={department}
        // ook departmentTo maken
      />
      <Tabs
        actions={
          <>
            {(departmentEmployee.canCreateEmployee &&
              location.pathname.endsWith('employees')) ||
            employeeId ? (
              <DialogButton
                description={''}
                form={
                  <UserForm
                    departmentId={departmentId}
                    organisationId={department!.organisation.id}
                    onSaved={function (user: User): void {
                      console.log('gebruiker aangemaakt', user);
                      closeDialog();
                    }}
                  />
                }
                icon="fas fa-plus"
                title="Nieuwe Medewerker"
              />
            ) : location.pathname.endsWith('schedules') ? (
              <DialogButton
                description={''}
                form={
                  <ScheduleForm
                    departmentId={departmentId as string}
                    onSaved={function (): void {
                      throw new Error('Function not implemented.');
                    }}
                  />
                }
                icon="fas fa-plus"
                title="Rooster toevoegen"
              />
            ) : (departmentEmployee.canCreateTask &&
                location.pathname.endsWith('/tasks')) ||
              taskId ? (
              <DialogButton
                description={''}
                form={
                  <TaskForm
                    departmentId={departmentId as string}
                    onSaved={(task: Task): void => {
                      setTimeout(() => closeDialog(), 100);
                    }}
                  />
                }
                icon="fas fa-plus"
                title="Nieuwe Taak"
              />
            ) : null}
          </>
        }
      >
        <Tabs.Tab to={`/departments/${departmentId}/`}>Afdeling</Tabs.Tab>
        {departmentEmployee.canViewEmployees && (
          <Tabs.Tab to={`/departments/${departmentId}/employees`}>
            Medewerkers
          </Tabs.Tab>
        )}
        {/* {departmentEmployee.canViewTasks && ( */}
        <Tabs.Tab
          to={`/departments/${departmentId}/tasks${
            prevDepartmentTaskId ? `/${prevDepartmentTaskId}` : ''
          }`}
        >
          Taken
        </Tabs.Tab>
        {/* )} */}
        <Tabs.Tab to={`/departments/${departmentId}/schedules`}>
          Roosters
        </Tabs.Tab>
        <span>{departmentEmployee.canViewTasks}</span>
      </Tabs>
      <Outlet />
    </div>
  );
}