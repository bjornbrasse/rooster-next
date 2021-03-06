import { Task } from '@prisma/client';
import * as React from 'react';
import { Link, LoaderFunction, Outlet, useLoaderData } from 'remix';
import { BBLoader } from 'types';
import { ColumnLookupView } from '~/components/column-lookp-view';
import Container from '~/components/container';
import { requireUser } from '~/controllers/auth.server';
import { getTasks } from '~/controllers/task.server';

type LoaderData = {
  tasks: Task[];
};

export const loader: BBLoader<{ departmentId: string }> = async ({
  params: { departmentId },
  request,
}): Promise<LoaderData> => {
  const tasks = await getTasks({ departmentId });

  return { tasks };
};

export default function DepartmentTasksLayout() {
  const { tasks } = useLoaderData<LoaderData>();

  return (
    <div>
      <h1>Taken layout</h1>
      <Outlet />
    </div>
  );
}
