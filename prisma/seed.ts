import { PrismaClient } from '@prisma/client';
import { seedDepartments } from './seed/departments';
import { seedOrganisations } from './seed/organisations';
import { seedAdminUser, seedUsers } from './seed/users';

const db = new PrismaClient();

async function seed() {
  await db.organisation.create({
    data: {
      name: 'Bra-c',
      slug: 'bra-c',
      employees: {
        create: {
          firstName: 'Bjorn',
          lastName: 'Brassé',
          email: 'bpbrasse@bra-c.nl  ',
        },
      },
    },
  });
  // const adminUser = await seedAdminUser({ db });

  // await seedOrganisations({ db });
  // const departments = await seedDepartments({ db, adminUser });
  // await seedUsers({ db, adminUser });

  // console.log('dit zijn ze:', departments);
}

seed();
