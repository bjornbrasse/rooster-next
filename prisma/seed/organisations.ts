import { Department, Organisation, PrismaClient, User } from '@prisma/client';
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
                    ({ firstName, lastName, email, passwordHash }) => ({
                      employee: {
                        create: {
                          firstName,
                          lastName,
                          email,
                          passwordHash,
                          organisation: { connect: { id: organisationId } },
                        },
                      },
                    })
                  ),
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
      departments?: (Pick<Department, 'name' | 'slugName'> &
        Partial<Department> & {
          users?: Pick<
            User,
            'firstName' | 'lastName' | 'email' | 'passwordHash'
          >[];
        })[];
    })[]
> {
  return [
    {
      name: 'Elisabeth-TweeSteden Ziekenhuis',
      nameShort: 'ETZ',
      slugName: 'etz',
      departments: [
        { name: 'Interne Geneeskunde', nameShort: 'H1', slugName: 'h1' },
        { name: 'Longgeneeskunde', slugName: 'longgk' },
        {
          name: 'Ziekenhuisapotheek',
          slugName: 'ziekenhuisapotheek',
          users: [
            {
              firstName: 'Bjorn',
              lastName: 'Brassé',
              email: 'b.brasse@etz.nl',
              passwordHash: await bcrypt.hash('test', 10),
            },
          ],
        },
      ],
    },
    {
      name: 'Elkerliek Ziekenhuis',
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
