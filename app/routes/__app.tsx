import { Menu, Transition } from '@headlessui/react';
import { Organisation, User } from '@prisma/client';
import dayjs from 'dayjs';
import { Fragment } from 'react';
import { LoaderFunction, NavLink, useLoaderData } from 'remix';
import { Link, Outlet, useLocation } from 'remix';
import Editor from '~/components/Editor';
import { useSchedule } from '~/contexts/schedule';
import { getUser } from '~/controllers/auth.server';

type LoaderData = {
  user: (User & { organisation: Organisation }) | null;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const user = await getUser(request);

  return { user };
};

export default function App() {
  const data = useLoaderData<LoaderData>();
  const { setShowSelectionDrawer, showSelectionDrawer } = useSchedule();

  const user = data?.user;

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
              } group rounded-md w-full px-3 py-1`}
            >
              <i className={`${icon} text-lg`} aria-hidden="true" />
              {caption}
            </Link>
          )}
        </Menu.Item>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div
        id="header"
        className="h-12 px-4 flex justify-between items-center bg-primary"
      >
        <Link
          to={
            user ? `/${user.organisation.slugName}/${user.firstName}` : '/home'
          }
          className="text-3xl font-bold text-accent cursor-pointer"
        >
          Rooster
        </Link>
        <div className="flex items-center">
          <button
            onClick={(prev) => setShowSelectionDrawer(!!prev)}
            className="w-8 h-8 mr-2 bg-gray-300 rounded-full"
          >
            <i className="fas fa-calendar-plus"></i>
          </button>
          {user ? (
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="inline-flex w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                {`${user.firstName} ${user.lastName}`}
                <i
                  className="fas fa-chevron-down w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
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
                <Menu.Items className="absolute right-0 z-10 w-56 mt-1 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-violet-500 text-white' : 'text-gray-900'
                        } group flex rounded-md items-center w-full px-2 py-2`}
                      >
                        {active ? (
                          <EditActiveIcon
                            className="w-5 h-5 mr-2"
                            aria-hidden="true"
                          />
                        ) : (
                          <EditInactiveIcon
                            className="w-5 h-5 mr-2"
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
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      >
                        {active ? (
                          <DuplicateActiveIcon
                            className="w-5 h-5 mr-2"
                            aria-hidden="true"
                          />
                        ) : (
                          <DuplicateInactiveIcon
                            className="w-5 h-5 mr-2"
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
                          } text-white text-center rounded-lg hover:bg-red-400 cursor-pointer`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </form>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <>
              <NavLink
                to="/auth/login"
                style={({ isActive }) => ({
                  display: 'block',
                  margin: '1rem 0',
                  color: isActive ? 'red' : '',
                })}
                className={({ isActive }) =>
                  `px-2 py-1 ${
                    isActive ? 'bg-accent' : 'text-white'
                  } rounded-lg`
                }
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      </div>
      <div className="flex-grow flex justify-between bg-gray-100">
        <Outlet />
        {showSelectionDrawer && (
          <div className="w-1/5 md:w-1/4 lg:w-[350px] shrink-0 p-2 border-2 border-green-900">
            <Editor />
          </div>
        )}
      </div>
    </div>
  );
}
