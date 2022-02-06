import { Link, Outlet, redirect } from 'remix';

export default function OrganisationAdmin() {
  return (
    <div className="h-full flex flex-col">
      {/* <div id="menu" className="p-4 flex items-center bg-gray-300">
        <h1>Medewerkers</h1>
      </div> */}
      <div id="content" className="flex-grow p-2 border-4 border-green-400">
        <Outlet />
      </div>
    </div>
  );
}
