import { Fragment, useEffect, useState } from 'react';
import { Menu, Switch, Transition } from '@headlessui/react';
import { Link, useFetcher } from 'remix';
import { UserSecure } from '~/controllers/auth.server';

function EditInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
    </svg>
  );
}

function EditActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  );
}

function DuplicateInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
    </svg>
  );
}

function DuplicateActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  );
}

// function ArchiveInactiveIcon(props) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <rect
//         x="5"
//         y="8"
//         width="10"
//         height="8"
//         fill="#EDE9FE"
//         stroke="#A78BFA"
//         strokeWidth="2"
//       />
//       <rect
//         x="4"
//         y="4"
//         width="12"
//         height="4"
//         fill="#EDE9FE"
//         stroke="#A78BFA"
//         strokeWidth="2"
//       />
//       <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
//     </svg>
//   );
// }

// function ArchiveActiveIcon(props) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <rect
//         x="5"
//         y="8"
//         width="10"
//         height="8"
//         fill="#8B5CF6"
//         stroke="#C4B5FD"
//         strokeWidth="2"
//       />
//       <rect
//         x="4"
//         y="4"
//         width="12"
//         height="4"
//         fill="#8B5CF6"
//         stroke="#C4B5FD"
//         strokeWidth="2"
//       />
//       <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
//     </svg>
//   );
// }

// function MoveInactiveIcon(props) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path d="M10 4H16V10" stroke="#A78BFA" strokeWidth="2" />
//       <path d="M16 4L8 12" stroke="#A78BFA" strokeWidth="2" />
//       <path d="M8 6H4V16H14V12" stroke="#A78BFA" strokeWidth="2" />
//     </svg>
//   );
// }

// function MoveActiveIcon(props) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path d="M10 4H16V10" stroke="#C4B5FD" strokeWidth="2" />
//       <path d="M16 4L8 12" stroke="#C4B5FD" strokeWidth="2" />
//       <path d="M8 6H4V16H14V12" stroke="#C4B5FD" strokeWidth="2" />
//     </svg>
//   );
// }

// function DeleteInactiveIcon(props) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <rect
//         x="5"
//         y="6"
//         width="10"
//         height="10"
//         fill="#EDE9FE"
//         stroke="#A78BFA"
//         strokeWidth="2"
//       />
//       <path d="M3 6H17" stroke="#A78BFA" strokeWidth="2" />
//       <path d="M8 6V4H12V6" stroke="#A78BFA" strokeWidth="2" />
//     </svg>
//   );
// }

// function DeleteActiveIcon(props) {
//   return (
//     <svg
//       {...props}
//       viewBox="0 0 20 20"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <rect
//         x="5"
//         y="6"
//         width="10"
//         height="10"
//         fill="#8B5CF6"
//         stroke="#C4B5FD"
//         strokeWidth="2"
//       />
//       <path d="M3 6H17" stroke="#C4B5FD" strokeWidth="2" />
//       <path d="M8 6V4H12V6" stroke="#C4B5FD" strokeWidth="2" />
//     </svg>
//   );
// }

function MenuItem({
  caption,
  href,
  icon,
}: {
  caption: string;
  href: string;
  icon: string;
}) {
  return (
    <div className="p-1">
      <Menu.Item>
        {({ active }) => (
          <Link
            to={href}
            className={`grid grid-cols-[30px_1fr] items-center ${
              active ? 'bg-violet-500 text-white' : 'text-gray-900'
            } group w-full rounded-md px-3 py-1`}
          >
            <i className={`${icon} text-lg`} aria-hidden="true" />
            {caption}
          </Link>
        )}
      </Menu.Item>
    </div>
  );
}

const UserMenu: React.FC<{ user: UserSecure }> = ({ user }) => {
  const [darkModeEnabled, setDarkModeEnabled] = useState(
    !!user.preferences?.darkMode,
  );
  const fetcher = useFetcher();

  useEffect(() => {
    fetcher.submit({ user: '123' });
  }, [darkModeEnabled]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex w-full rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        {`${user.firstName} ${user.lastName}`}
        <i
          className="fas fa-chevron-down ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
          aria-hidden="true"
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-1 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-violet-500 text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2`}
              >
                {active ? (
                  <EditActiveIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                ) : (
                  <EditInactiveIcon
                    className="mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                )}
                Edit
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                className={`${
                  active ? 'bg-violet-500 text-white' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                {active ? (
                  <DuplicateActiveIcon
                    className="mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                ) : (
                  <DuplicateInactiveIcon
                    className="mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                )}
                Duplicate
              </button>
            )}
          </Menu.Item>
          {user.role === 'ADMIN' && (
            <MenuItem
              caption={'Organinsaties'}
              href="/organisations"
              icon="fas fa-user-cog"
            />
          )}
          <MenuItem
            caption={'Profiel'}
            href={'/profile'}
            icon={'fas fa-user'}
          />
          <MenuItem
            caption={'Instellingen'}
            href={'/settings'}
            icon={'fas fa-cog'}
          />
          {user.role === 'ADMIN' && (
            <MenuItem caption={'Admin'} href="/admin" icon="fas fa-toolbox" />
          )}
          <Menu.Item>
            <fetcher.Form
              method="post"
              action="/_api/user/toggleDarkMode"
              replace
            >
              <Switch
                checked={darkModeEnabled}
                onChange={setDarkModeEnabled}
                name="darkMode"
                value="haha"
                className={`${
                  darkModeEnabled ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Enable notifications</span>
                <span
                  className={`${
                    darkModeEnabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white`}
                />
              </Switch>
            </fetcher.Form>
          </Menu.Item>
          <form
            action="/_api/auth/logout"
            method="POST"
            className="m-1 px-2 py-1"
          >
            <Menu.Item>
              {({ active }) => (
                <button
                  type="submit"
                  className={`w-full px-2 py-1 ${
                    active ? 'bg-red-400' : 'bg-cyan-500'
                  } cursor-pointer rounded-lg text-center text-white hover:bg-red-400`}
                >
                  Logout
                </button>
              )}
            </Menu.Item>
          </form>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserMenu;
