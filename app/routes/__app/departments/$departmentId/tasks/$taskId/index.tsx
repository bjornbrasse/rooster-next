import * as React from "react";
import { Task } from "@prisma/client";
import { LoaderFunction, redirect, useLoaderData } from "remix";
import Container from "~/components/Container";
import { getTask } from "~/controllers/task.server";

type LoaderData = {
  task: Task;
};

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData | Response> => {
  const url = new URL(request.url);

  const task = await getTask(params.taskId as string);

  if (!task) return redirect(url.pathname);

  return { task };
};

export default function DepartmentTask() {
  const { task } = useLoaderData<LoaderData>();

  return (
    <Container className="border-4 border-sky-500">
      <span>{task.name}</span>
    </Container>
  );
}
