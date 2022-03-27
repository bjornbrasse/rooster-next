import { PrismaClient } from '@prisma/client';
import { seedDepartments } from './seed/departments';
import { seedOrganisations } from './seed/organisations';
import { seedUsers } from './seed/users';

const db = new PrismaClient();

async function seed() {
  // await Promise.all(
  //   getUsers().map((user) => {
  //     return db.user.create({ data: user });
  //   })
  // );

  await seedOrganisations({ db });
  await seedDepartments({ db });
  await seedUsers({ db });
}

seed();
