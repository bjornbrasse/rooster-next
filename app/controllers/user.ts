import { db } from '~/utils/db.server';
import bcrypt from 'bcrypt';

export const createUser = async ({
  userData,
}: {
  userData: {
    email: string;
    firstName: string;
    lastName: string;
    organisation: string;
    password: string;
  };
}) => {
  const { password, ...userDataWithoutPassword } = userData;

  const user = await db.user.create({
    data: {
      ...userDataWithoutPassword,
      passwordHash: await bcrypt.hash(userData.password, 10),
    },
  });
};
