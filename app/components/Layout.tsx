import { User } from '@prisma/client';
import { LoaderFunction, NavLink, useLoaderData } from 'remix';
import { Link, Outlet, useLocation } from 'remix';
import { getUser } from '~/controllers/auth.server';

type LoaderData = {
  user: User | null;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const user = await getUser(request);

  return { user };
};

export default function Layout() {
  const location = useLocation();
  const data = useLoaderData<LoaderData>();

  return (
    <div className="h-full flex flex-col">
      <div
        id="header"
        className="h-12 px-4 flex justify-between items-center bg-purple-300"
      >
        <h1 className="text-2xl font-bold">Rooster {data?.user?.firstName}</h1>
        {location.pathname !== '/admin/organisations' && (
          <Link to="/admin/organisations" className="btn btn-save">
            Organisaties
          </Link>
        )}
        {data?.user ? (
          <h1>{data?.user.firstName}</h1>
        ) : (
          <>
            <NavLink
              to="/auth/register"
              style={({ isActive }) => {
                return {
                  display: 'block',
                  margin: '1rem 0',
                  color: isActive ? 'red' : '',
                };
              }}
            >
              Registreer
            </NavLink>
            <NavLink
              to="/auth/login"
              style={({ isActive }) => {
                return {
                  display: 'block',
                  margin: '1rem 0',
                  color: isActive ? 'red' : '',
                };
              }}
            >
              Login
            </NavLink>
          </>
        )}
      </div>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
