import { Task } from '@prisma/client';
import * as React from 'react';
import { Link, LoaderFunction, Outlet, useLoaderData } from 'remix';
import { ColumnLookupView } from '~/components/column-lookp-view';
import Container from '~/components/container';
import { getTasks } from '~/controllers/task.server';

type LoaderData = {
  tasks: Task[];
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const tasks = await getTasks({ departmentId: params.departmentId as string });

  return { tasks };
};

export default function DepartmentTasks() {
  const { tasks } = useLoaderData<LoaderData>();

  return (
    <div>
      <p>Taak</p>
    </div>
  );
}
