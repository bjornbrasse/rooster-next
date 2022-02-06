import { User } from '@prisma/client';
import { LoaderFunction, useLoaderData } from 'remix';
import { Link } from 'remix';
import { getUser, requireUser } from '~/controllers/auth.server';

type LoaderData = {
  user: User;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const user = await requireUser(request);

  return { user };
};

export default function Organisation() {
  const { user } = useLoaderData<LoaderData>();

  return (
    <div className="relative h-full border-4 border-secondary">
      <h2>Heel algemene informatie!</h2>
      {user.canViewOrganisations && (
        <Link to="admin" className="absolute top-2 right-2 btn btn-save">
          Admin
        </Link>
      )}
    </div>
  );
}
