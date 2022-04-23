import { PrismaClient } from '@prisma/client';
import { seedDepartments } from './seed/departments';
import { seedOrganisations } from './seed/organisations';
import { seedAdminUser, seedUsers } from './seed/users';

const db = new PrismaClient();

async function seed() {
  const adminUser = await seedAdminUser({ db });

  await seedOrganisations({ db, adminUser });

  // const departments = await seedDepartments({ db, adminUser });

  await seedUsers({ db, adminUser });
}

seed();
