import { PrismaClient } from '@prisma/client';
import { seedDepartments } from './seed/departments';
import { seedOrganisations } from './seed/organisations';
import { seedAdminUser, seedUsers } from './seed/users';

const db = new PrismaClient();

async function seed() {
  const adminUser = await seedAdminUser({ db });

  const organisations = await seedOrganisations({ db, adminUser });
  await seedUsers({ db, organisations });

  // const departments = await seedDepartments({
  //   db,
  //   adminUser,
  //   organisation: organisations[0],
  // });
}

seed();
