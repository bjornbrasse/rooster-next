import { Department, PrismaClient, Schedule, Task, User } from '@prisma/client';

export async function seedDepartments({ db }: { db: PrismaClient }) {
  const departments = await getDepartments();

  await db.department.createMany({
    data: departments?.map(
      ({ name, nameShort, organisationSlug, slug, ...department }) => ({
        name,
        nameShort: nameShort ?? '',
        organisationSlug,
        slug,
        // tasks: {
        //   create: department.tasks?.map(({ name }) => ({
        //     name,
        //   })),
        // },
      }),
    ),
  });
}

export function getDepartments(): (Pick<
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
  })[] {
  return [
    {
      name: 'Interne Geneeskunde',
      nameShort: 'H1',
      slug: 'h1',
      organisationSlug: 'etz',
      tasks: [
        { name: 'Cluster 1' },
        { name: 'Cluster 2' },
        { name: 'Cluster 3' },
      ],
    },
    {
      name: 'Longgeneeskunde',
      slug: 'longgk',
      organisationSlug: 'etz',
      tasks: [
        { name: 'Cluster 1' },
        { name: 'Cluster 2' },
        { name: 'Cluster 3' },
      ],
    },
    {
      name: 'Ziekenhuisapotheek',
      nameShort: 'zapo',
      slug: 'ziekenhuisapotheek',
      organisationSlug: 'etz',
      tasks: [
        { name: 'Cluster 1' },
        { name: 'Cluster 2' },
        { name: 'Cluster 3' },
      ],
    },
    {
      name: 'Ziekenhuisapotheek',
      nameShort: 'zapo',
      slug: 'ziekenhuisapotheek',
      organisationSlug: 'elkerliek',
      // tasks: [
      //   { name: 'Cluster 1' },
      //   { name: 'Cluster 2' },
      //   { name: 'Cluster 3' },
      // ],
    },
  ];
}
