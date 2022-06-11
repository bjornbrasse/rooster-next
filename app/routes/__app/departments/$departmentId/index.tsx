import { Schedule, Task, User } from '@prisma/client';
import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { json, Link, MetaFunction, useFetcher } from 'remix';
import { useLoaderData } from 'remix';
import { redirect } from 'remix';
import { BBHandle, BBLoader, LoaderDataBase } from 'types';
import { Container } from '~/components/container';
import { DraggableListItem } from '~/components/dragable-list-item';
import ScheduleForm from '~/components/forms/schedule-form';
import TaskForm from '~/components/forms/task-form';
import { Frame } from '~/components/frame';
import { Header } from '~/components/header';
import { useDialog } from '~/contexts/dialog';
import { requireUserId } from '~/controllers/auth.server';
import { getDepartment } from '~/controllers/department.server';
import { DnDItemTypes } from '~/utils/dnd';

export const meta: MetaFunction = ({ data }) => {
  return { title: data.department.name };
};

export const handle: BBHandle = {
  id: 'Bjorn',
};

type LoaderData = LoaderDataBase & {
  department: Exclude<Awaited<ReturnType<typeof getDepartment>>, null>;
};

export const loader: BBLoader<{ departmentId: string }> = async ({
  params: { departmentId },
  request,
}) => {
  await requireUserId(request);

  const department = await getDepartment({ departmentId });

  if (!department) {
    return redirect('/home');
  }

  return json<LoaderData>({ department });
};

export default function Department() {
  const { department } = useLoaderData() as LoaderData;
  const { closeDialog, openDialog } = useDialog();
  const [isEditingEmployees, setIsEditingEmployees] = useState(false);
  const fetcher = useFetcher();

  const [{ canDrop: canDropEmployee, isHovering }, dropRef] = useDrop(() => ({
    accept: DnDItemTypes.EMPLOYEE,
    canDrop: ({ organisationEmployee }) =>
      !department.employees.find(
        ({ employee }) => employee.id === organisationEmployee.id,
      ),
    drop: (item: { organisationEmployee: User }) => {
      fetcher.submit(
        {
          departmentId: department.id,
          employeeId: item.organisationEmployee.id,
        },
        { method: 'post', action: '/_api/department/addEmployee' },
      );
    },
    // openDialog(
    //   'Voeg taak toe aan rooster',
    //   <ScheduleTaskForm
    //     onSaved={(scheduleTask: ScheduleTask) => closeDialog()}
    //     schedule={schedule}
    //     task={item.task}
    //   />,
    // ),
    collect: (monitor) => ({
      canDrop: !!monitor.canDrop(),
      isHovering: !!monitor.isOver(),
    }),
  }));

  return (
    <div className="flex h-full">
      <Container>
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
          <Frame
            buttons={
              <button
                onClick={() => {
                  setIsEditingEmployees((prevValue) => !prevValue);
                }}
              >
                <i className="fas fa-pencil-alt"></i>
              </button>
            }
            canDrop={canDropEmployee}
            isHovering={isHovering}
            title="Medewerkers"
            ref={dropRef}
          >
            {department.employees.map(({ employee }) => (
              <div
                className="flex cursor-pointer justify-between hover:bg-blue-300"
                key={employee.id}
              >
                {`${employee.firstName} ${employee.lastName}`}
                {isEditingEmployees && (
                  <button>
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
            ))}
          </Frame>
          <Frame
            buttons={
              <button
                onClick={() =>
                  openDialog(
                    'Nieuwe Taak',
                    <TaskForm
                      onSaved={(task: Task) => {
                        closeDialog();
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
              <div
                className="cursor-pointer px-1 hover:bg-blue-300"
                onClick={() =>
                  openDialog(
                    'Taak bewerken',
                    <TaskForm
                      onSaved={(task: Task) => {
                        console.log('werkt dit?');
                        closeDialog();
                      }}
                      task={task}
                    />,
                  )
                }
              >
                {task.name}
              </div>
            ))}
          </Frame>
          <Frame
            buttons={
              <button
                onClick={() =>
                  openDialog(
                    'Nieuw Rooster',
                    <ScheduleForm
                      onSaved={(schedule: Schedule) => {
                        closeDialog();
                      }}
                      departmentId={department.id}
                    />,
                    'Maak een nieuw rooster aan.',
                  )
                }
              >
                <i className="fas fa-plus"></i>
              </button>
            }
            title="Roosters"
          >
            {department.schedules.map((schedule) => (
              <Link to={`/schedules/${schedule.id}`} key={schedule.id}>
                {schedule.name}
              </Link>
            ))}
          </Frame>
        </div>
      </Container>
      {isEditingEmployees && (
        <div className="w-72 border border-red-400 p-2">
          <h1 className="mb-4">Medewerkers</h1>
          <ul className="list-none">
            {department.organisation.employees.map((employee) => (
              <DraggableListItem item={employee} type={DnDItemTypes.EMPLOYEE}>
                {`${employee.firstName} ${employee.lastName}`}
              </DraggableListItem>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
