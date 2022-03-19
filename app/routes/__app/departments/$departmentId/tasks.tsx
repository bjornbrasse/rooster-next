import { Task } from "@prisma/client";
import * as React from "react";
import { Link, LoaderFunction, Outlet, useLoaderData } from "remix";
import ColumnLookupView from "~/components/column-lookp-view";
import Container from "~/components/Container";
import { getTasks } from "~/controllers/task.server";

type LoaderData = {
  tasks: Task[];
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const tasks = await getTasks({ departmentId: params.departmentId as string });

  return { tasks };
};

export default function DepartmentTasksLayout() {
  const { tasks } = useLoaderData<LoaderData>();

  return (
    // <Container className="border-4 border-red-600">
    //   {tasks.map((task) => (
    //     <Link to={task.id} className="border border-grey-400">
    //       {task.name}
    //     </Link>
    //   ))}
    // </Container>
    <ColumnLookupView
      listItems={tasks.map(({ id, name }) => ({ id, name }))}
      listTitle="Taken"
    >
      <Outlet />
    </ColumnLookupView>
  );
}
