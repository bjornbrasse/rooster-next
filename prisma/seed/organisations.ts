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

  for (const organisation of organisations) {
    const { name, slugName } = organisation;
    const organisationId = nanoid();

    await db.organisation.create({
      data: {
        id: organisationId,
        name,
        nameShort: organisation.nameShort ?? '',
        slugName,
        departments: {
          create: organisation.departments?.map(
            ({ name, slugName, ...department }) => {
              const departmentId = nanoid();

              return {
                id: departmentId,
                name,
                slugName,
                nameShort: department.nameShort ?? '',
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
                    })
                  ),
                },
                tasks: {
                  create: department.tasks?.map(({name}) => ({
                    name
                  }))
                },
                schedules: {
                  create: department.schedules?.map(({ name }) => ({
                    name,
                  })),
                },
              };
            }
          ),
        },
      },
    });
  }
}

export async function getOrganisations(): Promise<
  (Pick<Organisation, 'name' | 'slugName'> &
    Partial<Organisation> & {
      departments?: (Pick<Department, 'name' | 'slugName'> & Partial<Department> & {
        tasks?: Pick<Task, 'name'>[],
        schedules?: (Pick<Schedule, 'name'>)[];
          users?: (Pick<
            User,
            'firstName' | 'lastName' | 'initials' | 'email' | 'passwordHash'
          > &
            Partial<User>)[];
      })[]
       })[]
> {
  return [
    {
      name: 'Elisabeth-TweeSteden Ziekenhuis',
      nameShort: 'ETZ',
      slugName: 'etz',
      departments: [
        { name: 'Interne Geneeskunde', nameShort: 'H1', slugName: 'h1',  tasks: [
          { name: 'Cluster 1' },
          { name: 'Cluster 2' },
          { name: 'Cluster 3' },
        ],  },
        { name: 'Longgeneeskunde', slugName: 'longgk',  tasks: [
          { name: 'Cluster 1' },
          { name: 'Cluster 2' },
          { name: 'Cluster 3' },
        ], },
        {
          name: 'Ziekenhuisapotheek',
          slugName: 'ziekenhuisapotheek',
          schedules: [
            {
              name: 'Dienstrooster'
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
      slugName: 'elkerliek',
      departments: [
        { name: 'Cardiologie', slugName: '3A' },
        {
          name: 'Ziekenhuisapotheek',
          slugName: 'ziekenhuisapotheek',
        },
      ],
    },
  ];
}
