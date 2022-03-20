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
import { Section } from '~/components/section';

export const action: ActionFunction = async ({ request }) => {
  const Validator = z.object({
    taskId: z.string(),
    name: z.string(),
    description: z.string(),
    daysOfTheWeek: z.string(),
  });

  let task: Task | null = null;

  try {
    const { taskId, name, daysOfTheWeek, description } = Validator.parse(
      Object.fromEntries(await request.formData())
    );

    // task = await createTask(data);

    const task = await db.task.update({
      where: { id: taskId },
      data: { name, daysOfTheWeek, description },
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

  const [daysOfTheWeek, setDaysOfTheWeek] = React.useState(task.daysOfTheWeek);

  const setDaysOfTheWeekHandler = (e: React.BaseSyntheticEvent) => {
    const dotw = `${daysOfTheWeek.slice(0, e.target.value)}${
      daysOfTheWeek[e.target.value] === '0' ? '1' : '0'
    }${e.target.value < 6 ? daysOfTheWeek.slice(e.target.value - 6) : ''}`;

    setDaysOfTheWeek(dotw);
    // console.log(
    //   `${daysOfTheWeek}
    //   ${daysOfTheWeek.slice(0, e.target.value)} - ${
    //     daysOfTheWeek[e.target.value]
    //   } > ${daysOfTheWeek[e.target.value] === '0' ? '1' : '0'} - ${
    //     e.target.value < 6 ? daysOfTheWeek.slice(e.target.value - 6) : ''
    //   }`
    // );
    // console.log('1', daysOfTheWeek.substr(0, e.target.value));
    // console.log(
    //   `value ${daysOfTheWeek[e.target.value]} > ${
    //     daysOfTheWeek[e.target.value] === '0' ? '1' : '0'
    //   }`
    // );
    // console.log(
    //   '2',
    //   e.target.value,
    //   e.target.value - 6,
    //   daysOfTheWeek.slice(e.target.value - 6)
    // );

    // const dotw =
    //   daysOfTheWeek.slice(0, e.target.value) + daysOfTheWeek[e.target.value] ===
    //   '0'
    //     ? '1'
    //     : '0' + daysOfTheWeek.substr(e.target.value);

    console.log(daysOfTheWeek, 'dotw', dotw);
  };

  return (
    <Container className="grow border-4 border-red-500">
      <span>{task.name}</span>
      <Form
        method="post"
        onBlur={changeHandler}
        className="space-y-4"
        key={task.id}
      >
        <div className="grid grid-cols-[120px__minmax(120px,_1fr)] items-center space-y-4">
          <input type="hidden" name="taskId" value={task.id} />
          <input type="hidden" name="daysOfTheWeek" value={daysOfTheWeek} />

          <label htmlFor="name">Naam</label>
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={task.name}
            className="p-1"
          />
          <label htmlFor="description" className="self-start pt-1">
            Beschrijving
          </label>
          <textarea
            rows={3}
            name="description"
            id="description"
            defaultValue={task.description ?? ''}
          />
          <label htmlFor="durationPerDay">Duur per dag</label>
          <div className="flex items-center">
            <input
              type="text"
              name="durationPerDay"
              id="durationPerDay"
              defaultValue={task.durationPerDay.toString()}
              className="w-10 mr-2 p-1 text-center"
            />
            <span>uur</span>
          </div>
          <label htmlFor="description">Weekdagen</label>
          <div className="w-56 grid grid-cols-7 items-center" key={task.id}>
            <label htmlFor="monday">M</label>
            <label htmlFor="tuesday">D</label>
            <label htmlFor="wednesday">W</label>
            <label htmlFor="thursday">D</label>
            <label htmlFor="friday">V</label>
            <label htmlFor="saturday">Za</label>
            <label htmlFor="sunday">Zo</label>
            <input
              type="checkbox"
              name="monday"
              id="monday"
              value={1}
              checked={task.daysOfTheWeek[1] === '1'}
              onChange={setDaysOfTheWeekHandler}
            />
            <input
              type="checkbox"
              name="tuesday"
              id="tuesday"
              value={2}
              checked={task.daysOfTheWeek[2] === '1'}
              onChange={setDaysOfTheWeekHandler}
            />
            <input
              type="checkbox"
              name="wednesday"
              id="wednesday"
              value={3}
              checked={task.daysOfTheWeek[3] === '1'}
              onChange={setDaysOfTheWeekHandler}
            />
            <input
              type="checkbox"
              name="thursday"
              id="thursday"
              value={4}
              checked={task.daysOfTheWeek[4] === '1'}
              onChange={setDaysOfTheWeekHandler}
            />
            <input
              type="checkbox"
              name="friday"
              id="friday"
              value={5}
              checked={task.daysOfTheWeek[5] === '1'}
              onChange={setDaysOfTheWeekHandler}
            />
            <input
              type="checkbox"
              name="saturday"
              id="saturday"
              value={6}
              checked={task.daysOfTheWeek[6] === '1'}
              onChange={setDaysOfTheWeekHandler}
            />
            <input
              type="checkbox"
              name="sunday"
              id="sunday"
              value={0}
              checked={task.daysOfTheWeek[0] === '1'}
              onChange={setDaysOfTheWeekHandler}
            />
          </div>
        </div>
        <Section caption="Competenties"></Section>
        {transition.state === 'submitting' ? <p>Saving...</p> : <p>Idle</p>}
      </Form>
    </Container>
  );
}
