import { Department, PrismaClient, Schedule, Task, User } from '@prisma/client';
import { departmentsData } from './data';

export type NewDeparmtentData = Pick<
  Department,
  'name' | 'slug' | 'organisationSlug'
> &
  Partial<Department> & {
    organisationSlug: string;
    tasks?: Pick<Task, 'name'>[];
    schedules?: Pick<Schedule, 'name' | 'slug'>[];
    users?: (Pick<
      User,
      'firstName' | 'lastName' | 'initials' | 'email' | 'passwordHash'
    > & {
      authorisations?: {
        canCreateEmployee: boolean;
        canCreateTask: boolean;
        canViewEmployees: boolean;
        canViewTasks: boolean;
      };
    } & Partial<User>)[];
  };

export async function seedDepartments({
  db,
  adminUser,
}: {
  db: PrismaClient;
  adminUser: User;
}): Promise<Department[]> {
  const data: NewDeparmtentData[] = departmentsData();

  return await Promise.all(
    data.map((department) => {
      return db.department.create({
        data: {
          createdById: adminUser.id,
          tasks: {
            create: department.tasks?.map((task) => ({
              createdById: adminUser.id,
              ...task,
            })),
          },
          ...department,
        },
      });
    }),
  );
}
