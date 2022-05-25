import {
  Department,
  Organisation,
  PrismaClient,
  Schedule,
  Task,
  User,
} from '@prisma/client';

export type DepartmentData = Pick<Department, 'name' | 'slug'> &
  Partial<Department> & {
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

const departmentData: DepartmentData[] = [
  {
    name: 'Ziekenhuisapotheek',
    slug: 'ziekenhuisapotheek',
  },
];

export async function seedDepartments({
  db,
  adminUser,
  organisation,
}: {
  db: PrismaClient;
  adminUser: User;
  organisation: Organisation;
}): Promise<Department[]> {
  return await Promise.all(
    departmentData.map((department) => {
      return db.department.create({
        data: {
          ...department,
          createdById: adminUser.id,
          organisationId: organisation.id,
          // tasks: {
          //   create: department.tasks?.map((task) => ({
          //     createdById: adminUser.id,
          //     ...task,
          //   })),
          // },
        },
      });
    }),
  );
}
