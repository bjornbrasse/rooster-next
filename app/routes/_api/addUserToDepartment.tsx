import { User } from "@prisma/client";
import type { ActionFunction } from "remix";
import { getUser } from "~/controllers/auth.server";
import { getDepartment } from "~/controllers/department.server";
import { createUser } from "~/controllers/user.server";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/helpers";

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  const userId = form.get("userId");
  const departmentId = form.get("departmentId");

  console.log("doet ie het?", userId, departmentId);

  if (typeof userId !== "string" || typeof departmentId !== "string") {
    return badRequest({
      error: { form: `Form not submitted correctly.` },
    });
  }

  // const fields = { firstName, lastName, email };

  // if (Object.values(fieldErrors).some(Boolean))
  //   return badRequest({
  //     error: { fields: fieldErrors },
  //     // fields,
  //   });

  const user = await getUser(request);
  const department = await getDepartment({ departmentId });

  if (!user || !department)
    return badRequest({
      error: { form: "Something went wrong - 2" },
      // fields,
    });

  const res = await db.departmentEmployee.create({
    data: { userId, departmentId },
  });

  if (!res)
    return badRequest({
      error: { form: "Something went wrong - 3" },
      // fields,
    });

  return { res };
};

export default () => null;
