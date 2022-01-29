import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seed/users';
const db = new PrismaClient();

async function seed() {
  // await Promise.all(
  //   getUsers().map((user) => {
  //     return db.user.create({ data: user });
  //   })
  // );
  await seedUsers(db);
}

seed();
