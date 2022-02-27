import * as React from 'react';
import { Task, User } from '@prisma/client';
import { useFetcher } from 'remix';
import { Combobox, Transition } from '@headlessui/react';

const MemberForm = ({
  onSaved: savedHandler,
  redirectTo = '/',
  scheduleId,
  departmentEmployees,
}: {
  onSaved: (task: Task) => void;
  redirectTo: string;
  scheduleId: string;
  departmentEmployees: User[];
}) => {
  const [selectedPerson, setSelectedPerson] = React.useState<User | null>(null);
  const [query, setQuery] = React.useState('');

  const filteredPeople =
    query === ''
      ? departmentEmployees
      : departmentEmployees.filter((user) => {
          return (
            user.firstName.toLowerCase().includes(query.toLowerCase()) ||
            user.lastName.toLowerCase().includes(query.toLowerCase())
          );
        });

  const fetcher = useFetcher();

  React.useEffect(() => {
    if (fetcher.data?.task) {
      savedHandler(fetcher.data.task);
    }
  }, [fetcher]);

  return (
    <fetcher.Form method="post" action="/_api/task" className="h-[300px]">
      <input type="hidden" name="scheduleId" value={scheduleId} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      {/* <fieldset className="flex flex-col"> */}
      <label htmlFor="firstName">Afdelingsmensen</label>
      {/* {fetcher.data?.error?.fields?.name && (
          <p>Fout - {fetcher.data?.error?.fields?.name}</p>
        )} */}
      <Combobox value={selectedPerson} onChange={setSelectedPerson}>
        <div className="relative mt-1">
          <div className="relative w-full text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-teal-300 focus-visible:ring-offset-2 sm:text-sm overflow-hidden">
            <Combobox.Input
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(user: User) =>
                user ? `${user.firstName} ${user.lastName}` : ''
              }
              className="w-full focus:ring-0 py-2 pl-3 pr-10 text-sm leading-5 bg-white border border-gray-800 text-gray-900"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <i
                className="fas fa-up-down w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={React.Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredPeople.length === 0 && query !== '' ? (
                <div className="cursor-default select-none relative py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredPeople.map((user) => (
                  <Combobox.Option
                    key={user.id}
                    className={({ active }) =>
                      `cursor-default select-none relative py-2 pl-10 pr-4 ${
                        active ? 'text-white bg-teal-600' : 'text-gray-900'
                      }`
                    }
                    value={user}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {`${user.firstName} ${user.lastName}`}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <i
                              className="fas fa-check w-5 h-5"
                              aria-hidden="true"
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {/* </fieldset> */}
      <button type="submit" className="btn btn-save">
        Opslaan
      </button>
    </fetcher.Form>
  );
};

export default MemberForm;
