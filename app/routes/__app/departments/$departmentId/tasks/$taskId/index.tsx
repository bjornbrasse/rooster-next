import * as React from 'react';
import { Task } from '@prisma/client';
import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
  useSubmit,
  useTransition,
} from 'remix';
import Container from '~/components/Container';
import { getTask } from '~/controllers/task.server';
import { z } from 'zod';
import { db } from '~/utils/db.server';
import { badRequest } from '~/utils/helpers';

export const action: ActionFunction = async ({ request }) => {
  const Validator = z.object({
    taskId: z.string(),
    name: z.string(),
    description: z.string(),
  });

  let task: Task | null = null;

  try {
    const { taskId, name, description } = Validator.parse(
      Object.fromEntries(await request.formData())
    );

    // task = await createTask(data);

    const task = await db.task.update({
      where: { id: taskId },
      data: { name, description },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log('er treedt een Zod-fout op', error.flatten());

      return badRequest(error.format());
    }
    console.log('er treedt een fout op', error);
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
    <Container className="grow border-4 border-red-500">
      <span>{task.name}</span>
      <Form
        method="post"
        onBlur={changeHandler}
        className="grid grid-cols-[120px__minmax(120px,_1fr)] space-y-4"
        key={task.id}
      >
        <input type="hidden" name="taskId" value={task.id} />

        <label htmlFor="name">Naam</label>
        <input type="text" name="name" id="name" defaultValue={task.name} />
        <label htmlFor="description">Beschrijving</label>
        <textarea
          rows={3}
          name="description"
          id="description"
          defaultValue={task.description ?? ''}
        />
        {transition.state === 'submitting' ? <p>Saving...</p> : <p>Idle</p>}
      </Form>
    </Container>
  );
}
