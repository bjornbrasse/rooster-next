import {
  Schedule,
  ScheduleMember,
  ScheduleTask,
  Task,
  User,
} from '@prisma/client';
import { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Link, redirect, useLoaderData } from 'remix';
import { BBLoader } from 'types';
import { Container } from '~/components/container';
import { DraggableListItem } from '~/components/dragable-list-item';
import MemberForm from '~/components/forms/MemberForm';
import ScheduleMemberForm from '~/components/forms/schedule-member-form';
import ScheduleTaskForm from '~/components/forms/schedule-task-form';
import TaskForm from '~/components/forms/task-form';
import { Frame } from '~/components/frame';
import { TaskListItem } from '~/components/task-list-item';
import { useDialog } from '~/contexts/dialog';
import { getSchedule } from '~/controllers/schedule.server';
import { DnDItemTypes } from '~/utils/dnd';
import { links as scheduleTaskFormLinks } from '~/components/forms/schedule-task-form';

export const links = () => [...scheduleTaskFormLinks()];

type LoaderData = {
  schedule: Exclude<Awaited<ReturnType<typeof getSchedule>>, null>;
};

export const loader: BBLoader<{ scheduleId: string }> = async ({
  params: { scheduleId },
}) => {
  const schedule = await getSchedule({ scheduleId });

  if (!schedule) return redirect('/schedules');

  return { schedule };
};

export default function Schedule() {
  const { closeDialog, openDialog } = useDialog();
  const { schedule } = useLoaderData() as LoaderData;
  const [isEditingMembers, setIsEditingMembers] = useState(false);
  const [isEditingTasks, setIsEditingTasks] = useState(false);

  const [{ canDropMember, isHoveringMember }, dropRefMember] = useDrop(() => ({
    accept: DnDItemTypes.EMPLOYEE,
    canDrop: ({ member }) =>
      !schedule.scheduleMembers.find(({ memberId }) => memberId === member.id),
    drop: (item: { member: User }) =>
      openDialog(
        'Voeg team-lid toe aan rooster',
        <ScheduleMemberForm
          onSaved={(scheduleMember: ScheduleMember) => closeDialog()}
          schedule={schedule}
          member={item.member}
        />,
      ),
    collect: (monitor) => ({
      canDropMember: !!monitor.canDrop(),
      isHoveringMember: !!monitor.isOver(),
    }),
  }));

  const [{ canDrop, isHovering }, dropRef] = useDrop(() => ({
    accept: DnDItemTypes.TASK,
    canDrop: ({ task }) =>
      !schedule.scheduleTasks.find((st) => st.taskId === task.id),
    drop: (item: { task: Task }) =>
      openDialog(
        'Voeg taak toe aan rooster',
        <ScheduleTaskForm
          onSaved={(scheduleTask: ScheduleTask) => closeDialog()}
          schedule={schedule}
          task={item.task}
        />,
      ),
    collect: (monitor) => ({
      canDrop: !!monitor.canDrop(),
      isHovering: !!monitor.isOver(),
    }),
  }));

  return (
    <div className="flex h-full">
      <Container>
        <div className="mb-4">
          <Link
            to={`/${schedule.department.organisation.slug}/${schedule.department.slug}/${schedule.slug}`}
          >
            {schedule.name}
          </Link>
          <Link
            to={`/departments/${schedule.departmentId}`}
            className="text-gray-500 underline decoration-solid hover:text-blue-600"
          >
            {schedule.department.name}
          </Link>
        </div>
        <div id="content" className="flex flex-col space-y-8">
          <Frame
            buttons={
              <button
                onClick={() => {
                  setIsEditingTasks(false);
                  setIsEditingMembers((prevValue) => !prevValue);
                }}
              >
                <i className="fas fa-pencil-alt"></i>
              </button>
            }
            canDrop={canDropMember}
            isHovering={isHoveringMember}
            ref={dropRefMember}
            title="Leden"
          >
            {schedule.scheduleMembers
              .map((sm) => ({ user: sm.member }))
              .sort(({ user: a }, { user: b }) =>
                a.lastName < b.lastName ? -1 : 0,
              )
              .map(({ user }) => (
                <div key={user.id}>{user.lastName}</div>
              ))}
          </Frame>
          <Frame
            buttons={
              <button
                onClick={() => {
                  setIsEditingMembers(false);
                  setIsEditingTasks((prevValue) => !prevValue);
                }}
              >
                <i className="fas fa-pencil-alt"></i>
              </button>
            }
            canDrop={canDrop}
            isHovering={isHovering}
            title="Taken"
            ref={dropRef}
          >
            {schedule.scheduleTasks.map(({ task }) => (
              <div className="flex justify-between" key={task.id}>
                {task.name}
                {isEditingTasks && (
                  <button>
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
            ))}
          </Frame>
        </div>
      </Container>
      {isEditingMembers && (
        <div className="w-72 border border-red-400 p-2">
          <h1 className="mb-4">Medewerkers {schedule.department.name}</h1>
          <ul className="list-none">
            {schedule.department.employees.map(({ employee }) => (
              <DraggableListItem item={employee} type={DnDItemTypes.EMPLOYEE}>
                {`${employee.firstName} ${employee.lastName}`}
              </DraggableListItem>
            ))}
          </ul>
        </div>
      )}
      {isEditingTasks && (
        <div className="w-72 border border-red-400 p-2">
          <div className="flex justify-between">
            <h1 className="mb-4">{`Taken van ${schedule.department.name}`}</h1>
            <button
              className="btn btn-save h-8 w-8"
              onClick={() =>
                openDialog(
                  'Maak Taak',
                  <TaskForm
                    departmentId={schedule.departmentId}
                    onSaved={(task: Task) => closeDialog()}
                    scheduleId={schedule.id}
                  />,
                )
              }
            >
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <ul className="list-none">
            {schedule.department.tasks.map((task) => (
              <TaskListItem task={task} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
