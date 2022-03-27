import { Department, PrismaClient, Schedule, Task, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

export async function seedDepartments({ db }: { db: PrismaClient }) {
  const departments = await getDepartments();

  let departmentId: string;
  let userId: string;

  for (const department of departments) {
    const { name, slug } = department;
    const departmentId = nanoid();

    await db.department.create({
      data: {
        id: departmentId,
        name,
        nameShort: department.nameShort ?? '',
        slug,
        departments: {
          create: department.departments?.map(
            ({ name, slug, nameShort, ...department }) => {
              const departmentId = nanoid();

              return {
                id: departmentId,
                name,
                slug,
                nameShort: nameShort ?? '',
                employees: {
                  create: department.users?.map(
                    ({
                      role,
                      firstName,
                      lastName,
                      initials,
                      email,
                      passwordHash,
                      ...user
                    }) => {
                      const id = nanoid();

                      return {
                        user: {
                          create: {
                            id: role === 'ADMIN' ? id : nanoid(),
                            createdBy: { connect: { id } },
                            firstName,
                            lastName,
                            initials,
                            email,
                            passwordHash,
                            role,
                            department: { connect: { id: departmentId } },
                          },
                        },
                        ...user.authorisations,
                      };
                    },
                  ),
                },
                tasks: {
                  create: department.tasks?.map(({ name }) => ({
                    name,
                  })),
                },
                schedules: {
                  create: department.schedules?.map(({ name, slug }) => ({
                    name,
                    slug,
                  })),
                },
              };
            },
          ),
        },
      },
    });
  }
}

export function getDepartments(): (Pick<Department, 'name' | 'slug'> &
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
  ];
}
