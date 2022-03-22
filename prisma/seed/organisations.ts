import {
  Department,
  Organisation,
  PrismaClient,
  Schedule,
  Task,
  User,
} from '@prisma/client';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

export async function seedOrganisations({ db }: { db: PrismaClient }) {
  const organisations = await getOrganisations();

  let departmentId: string;
  let userId: string;

  for (const organisation of organisations) {
    const { name, slug } = organisation;
    const organisationId = nanoid();

    await db.organisation.create({
      data: {
        id: organisationId,
        name,
        nameShort: organisation.nameShort ?? '',
        slug,
        departments: {
          create: organisation.departments?.map(
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
                      firstName,
                      lastName,
                      initials,
                      email,
                      passwordHash,
                      ...user
                    }) => ({
                      user: {
                        create: {
                          firstName,
                          lastName,
                          initials,
                          email,
                          passwordHash,
                          role: user?.role,
                          organisation: { connect: { id: organisationId } },
                        },
                      },
                      ...user.authorisations,
                    }),
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

export async function getOrganisations(): Promise<
  (Pick<Organisation, 'name' | 'slug'> &
    Partial<Organisation> & {
      departments?: (Pick<Department, 'name' | 'slug'> &
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
        })[];
    })[]
> {
  return [
    {
      name: 'Elisabeth-TweeSteden Ziekenhuis',
      nameShort: 'ETZ',
      slug: 'etz',
      departments: [
        {
          name: 'Interne Geneeskunde',
          nameShort: 'H1',
          slug: 'h1',
          tasks: [
            { name: 'Cluster 1' },
            { name: 'Cluster 2' },
            { name: 'Cluster 3' },
          ],
        },
        {
          name: 'Longgeneeskunde',
          slug: 'longgk',
          tasks: [
            { name: 'Cluster 1' },
            { name: 'Cluster 2' },
            { name: 'Cluster 3' },
          ],
        },
        {
          name: 'Ziekenhuisapotheek',
          slug: 'ziekenhuisapotheek',
          schedules: [
            {
              name: 'Dienstrooster',
              slug: 'dienstrooster',
            },
          ],
          users: [
            {
              role: 'ADMIN',
              firstName: 'Bjorn',
              lastName: 'Brassé',
              initials: 'BB',
              email: 'b.brasse@etz.nl',
              passwordHash: await bcrypt.hash('test', 10),
              authorisations: {
                canCreateEmployee: true,
                canCreateTask: true,
                canViewEmployees: true,
                canViewTasks: true,
              },
            },
            {
              firstName: 'Michelle',
              lastName: 'de Roo',
              initials: 'MdR',
              email: 'm.deroo@etz.nl',
              passwordHash: await bcrypt.hash('test', 10),
            },
          ],
        },
      ],
    },
    {
      name: 'Elkerliek Ziekenhuis',
      nameShort: 'Elkerliek',
      slug: 'elkerliek',
      departments: [
        { name: 'Cardiologie', slug: '3A' },
        {
          name: 'Ziekenhuisapotheek',
          slug: 'ziekenhuisapotheek',
        },
      ],
    },
  ];
}
