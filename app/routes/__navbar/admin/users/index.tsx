import { User } from '@prisma/client';
import { LoaderFunction, useLoaderData } from 'remix';
import { Container } from '~/components/container';
import { UserForm } from '~/components/forms/user-form';
import { Frame } from '~/components/frame';
import { UserTable } from '~/components/tables/user-table';
import { useDialog } from '~/contexts/dialog';
import { requireUser } from '~/controllers/auth.server';
import { db } from '~/utils/db.server';

async function getUsers() {
  return await db.user.findMany();
}

type LoaderData = {
  users: Awaited<ReturnType<typeof getUsers>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request, { isAdmin: true });

  const users = await getUsers();

  return { users };
};

export default function OrganisationEmployees() {
  const { closeDialog, openDialog } = useDialog();
  const { users } = useLoaderData() as LoaderData;

  return (
    <Container>
      <Frame
        buttons={
          <button
            onClick={() =>
              openDialog(
                'Gebruiker aanmaken',
                <UserForm
                  onSaved={(user: User) => {
                    closeDialog();
                  }}
                />,
              )
            }
          >
            <i className="fas fa-plus"></i>
          </button>
        }
        title="Gebruikers"
      >
        <UserTable baseUrl={''} users={users} />
      </Frame>
      <div className="h-1/2 border-2 border-red-300">
        <h1>Hoi</h1>
      </div>
    </Container>
  );
}
