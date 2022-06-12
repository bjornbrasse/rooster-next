import { Outlet } from 'remix';

export default function SettingsLayout() {
  return (
    <div className="flex border-4 border-red-800">
      <div id="menu" className="border-r-2 border-blue-400"></div>
      <div className="border-2 border-green-500">
        <Outlet />
      </div>
    </div>
  );
}
