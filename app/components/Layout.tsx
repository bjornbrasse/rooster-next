import { Link, Outlet, useLocation } from 'remix';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="h-full flex flex-col">
      <div
        id="header"
        className="h-12 px-4 flex justify-between items-center bg-purple-300"
      >
        <h1 className="text-2xl font-bold">Rooster</h1>
        {location.pathname !== '/admin/organisations' && (
          <Link to="/admin/organisations" className="btn btn-save">
            Organisaties
          </Link>
        )}
      </div>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
