import { ActionFunction, json } from 'remix';
import { badRequest } from '~/utils/helpers';
import { createDepartment } from '~/controllers/department.server';
import { z } from 'zod';
import { inferSafeParseErrors } from 'types';
import { requireUserId } from '~/controllers/auth.server';
import { db } from '~/utils/db.server';
import { DepartmentEmployee } from '@prisma/client';

const schema = z.object({
  assignedById: z.string(),
  departmentId: z.string(),
  employeeId: z.string(),
});

export type ActionData =
  | {
      success: false;
      fields?: z.input<typeof schema>;
      errors?: inferSafeParseErrors<typeof schema>;
    }
  | {
      success: true;
      departmentEmployee: DepartmentEmployee;
    };

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const result = schema.safeParse({
    ...Object.fromEntries(await request.formData()),
    assignedById: userId,
  });
  if (!result.success) {
    return badRequest({ error: result.error.flatten() });
  }

  const { assignedById, departmentId, employeeId } = result.data;

  const departmentEmployee = await db.departmentEmployee.create({
    data: {
      assignedBy: { connect: { id: assignedById } },
      department: { connect: { id: departmentId } },
      employee: { connect: { id: employeeId } },
    },
  });

  if (!departmentEmployee)
    return badRequest<ActionData>({
      success: false,
      errors: { formErrors: ['DepartmentEmployee not created'] },
    });

  return json<ActionData>({ success: true, departmentEmployee });
};

export default () => null;
