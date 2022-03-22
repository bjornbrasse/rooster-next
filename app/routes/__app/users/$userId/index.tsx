import { User } from '@prisma/client';
import {
  Link,
  LoaderFunction,
  useActionData,
  useLoaderData,
  useParams,
} from 'remix';
import { UserForm } from '~/components/forms/user-form';
import { db } from '~/utils/db.server';

type ActionData = {
  formError?: string;
  fieldErrors?: {
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    password: string | undefined;
  };
  fields?: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

type LoaderData = {
  user: User;
};

export const loader: LoaderFunction = async ({ params }) => {
  const userId = params.userId as string;

  const user = await db.user.findUnique({ where: { id: userId } });
  console.log('gebruiker gevonden', user);

  return { user };
};

export default function UserRoute() {
  const data = useActionData<ActionData>();
  const { user } = useLoaderData<LoaderData>();

  return (
    <div className="p-24">
      <Link to="../users" className="btn btn-save">
        <i className="fas fa-chevron-left mr-3"></i>
        Gebruikers
      </Link>

      <div className="my-12 w-1/2">
        <UserForm user={user} />
      </div>
    </div>
  );
}
