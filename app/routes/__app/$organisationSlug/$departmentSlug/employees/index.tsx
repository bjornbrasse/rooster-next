import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { json, useFetcher, useLoaderData, useMatches, useParams } from 'remix';
import { BBLoader, User } from 'types';
import { Container } from '~/components/container';
import { Frame } from '~/components/frame';
import { db } from '~/utils/db.server';
import { DnDItemTypes } from '~/utils/dnd';
import { LoaderData as DepartmentLoaderData } from '../index';

async function getDepartmentEmployees({
  departmentSlug: slug,
}: {
  departmentSlug: string;
}) {
  return await db.departmentEmployee.findMany({
    where: { department: { slug } },
    include: { employee: true },
  });
}

type LoaderData = {
  departmentEmployees: Awaited<ReturnType<typeof getDepartmentEmployees>>;
};

export const loader: BBLoader<{ departmentSlug: string }> = async ({
  params: { departmentSlug },
}) => {
  const departmentEmployees = await getDepartmentEmployees({ departmentSlug });

  return json<LoaderData>({ departmentEmployees });
};

export default function DepartmentEmployees() {
  const { departmentEmployees } = useLoaderData() as LoaderData;
  const [isEditingEmployees, setIsEditingEmployees] = useState(false);
  const fetcher = useFetcher();
  const { departmentSlug, organisationSlug } = useParams();

  const { department } = useMatches().find(
    (m) => m.pathname === `/${organisationSlug}/${departmentSlug}`,
  )?.data as DepartmentLoaderData;

  const [{ canDrop: canDropEmployee, isHovering }, dropRef] = useDrop(() => ({
    accept: DnDItemTypes.EMPLOYEE,
    canDrop: ({ organisationEmployee }) =>
      !departmentEmployees.find(
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
    <Container>
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
        {departmentEmployees.map(({ employee }) => (
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
    </Container>
    // {isEditingEmployees && (
    //   <div className="w-72 border border-red-400 p-2">
    //     <h1 className="mb-4">Medewerkers</h1>
    //     <ul className="list-none">
    //       {department.organisation.employees.map((employee) => (
    //         <DraggableListItem item={employee} type={DnDItemTypes.EMPLOYEE}>
    //           {`${employee.firstName} ${employee.lastName}`}
    //         </DraggableListItem>
    //       ))}
    //     </ul>
    //   </div>
    // )}
  );
}
