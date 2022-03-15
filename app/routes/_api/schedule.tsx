import type { ActionFunction } from "remix";
import { Schedule } from "@prisma/client";
import { badRequest } from "~/utils/helpers";
import { validateText } from "~/utils/validation";
import { createSchedule } from "~/controllers/schedule.server";

type Fields = {
  name?: string;
};

type FieldErrors = {
  name?: string[] | undefined;
};

export type ActionData = {
  error?: {
    form?: string;
    fields?: FieldErrors;
  };
  fields?: Fields;
  schedule?: Schedule | null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const name = form.get("name");
  const departmentId = form.get("departmentId");

  if (typeof name !== "string" || typeof departmentId !== "string") {
    return badRequest<ActionData>({
      error: { form: `Form not submitted correctly.` },
    });
  }
  const fields = { name };

  const fieldErrors: FieldErrors = {
    name: validateText(name, {
      min: { length: 2, errorMessage: "MOORE than 2" },
    }),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest<ActionData>({
      error: { fields: fieldErrors },
      fields,
    });

  const schedule = await createSchedule({
    schedule: { name },
    departmentId,
  });

  if (!schedule)
    return badRequest<ActionData>({
      error: { form: "Something went wrong." },
      fields,
    });

  return { schedule };
};

export default () => null;
