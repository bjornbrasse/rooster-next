import * as React from "react";
import { Task } from "@prisma/client";
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
  useSubmit,
  useTransition,
} from "remix";
import Container from "~/components/Container";
import { getTask } from "~/controllers/task.server";
import { z } from "zod";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/helpers";

export const action: ActionFunction = async ({ request }) => {
  const Validator = z.object({
    taskId: z.string(),
    name: z.string(),
  });

  let task: Task | null = null;

  try {
    const { taskId, name } = Validator.parse(
      Object.fromEntries(await request.formData())
    );

    // task = await createTask(data);

    const task = await db.task.update({
      where: { id: taskId },
      data: { name },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("er treedt een Zod-fout op", error.flatten());

      return badRequest(error.format());
    }
    console.log("er treedt een fout op", error);
  }

  return json(task, { status: 200 });
};

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
  const submit = useSubmit();
  const transition = useTransition();

  function changeHandler(e: React.BaseSyntheticEvent) {
    submit(e.currentTarget, { replace: false });
  }

  // const changeHandler = (e: React.BaseSyntheticEvent) =>
  //   React.useMemo(() => {
  //     const delayDebounceFn = setTimeout(() => {
  //       console.log(e.currentTarget);
  //       submit(e.currentTarget, { replace: false });
  //     }, 3000);

  //     return () => clearTimeout(delayDebounceFn);
  //   }, [e.currentTarget]);

  return (
    <Container className="border-4 border-sky-500">
      <span>{task.name}</span>
      <div className="m-4 border-2 border-sky-500 rounded-lg">
        <Form method="post" onBlur={changeHandler} key={task.id}>
          <input type="hidden" name="taskId" value={task.id} />
          <input type="text" name="name" id="name" defaultValue={task.name} />
          {transition.state === "submitting" ? <p>Saving...</p> : <p>Idle</p>}
        </Form>
      </div>
    </Container>
  );
}
