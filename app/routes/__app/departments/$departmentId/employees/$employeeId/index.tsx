import { DepartmentEmployee, User } from '@prisma/client';
import clsx from 'clsx';
import dayjs from 'dayjs';
import * as React from 'react';
import { Form, useLoaderData } from 'remix';
import { Section } from '~/components/section';
import { getDepartmentEmployee } from '~/controllers/department';
import { BBLoader } from '~/types';
import { WEEKDAYS } from '~/utils/date';

type LoaderData = {
  departmentEmployee: Awaited<ReturnType<typeof getDepartmentEmployee>>;
};

export const loader: BBLoader<{
  employeeId: string;
}> = async ({
  params: { employeeId: departmentEmployeeId },
}): Promise<LoaderData> => {
  const departmentEmployee = await getDepartmentEmployee({
    departmentEmployeeId,
  });

  return { departmentEmployee };
};

const WEEKDAYS_NAME_ENG = WEEKDAYS.map((d) => d.name.eng);
const WEEKDAYS_ABBR_NL = WEEKDAYS.map((d) => d.abbr.nl);

export default function Employee() {
  const { departmentEmployee } = useLoaderData() as LoaderData;
  const { canCreateEmployee, canViewEmployees, user } = departmentEmployee;

  return (
    <div className="p-2 flex flex-col space-y-4">
      <p>{user.firstName}</p>
      <Section caption="Aanwezigheid">
        <div className="mb-1 grid grid-cols-[minmax(200px,300px)_56px_56px_56px_56px_56px_56px_56px] space-x-2 justify-start">
          <p>Vanaf</p>
          {[1, 2, 3, 4, 5, 6, 0].map((day) => (
            <label htmlFor={WEEKDAYS_NAME_ENG[day]} className="text-center">
              {WEEKDAYS_ABBR_NL[day]}
            </label>
          ))}
        </div>
        {departmentEmployee.presences.map((presence) => {
          const isBefore = dayjs(presence.from).isBefore(dayjs(), 'day');

          return (
            <div className="grid grid-cols-[minmax(200px,300px)_56px_56px_56px_56px_56px_56px_56px] space-x-2 space-y-2 items-center">
              <span>{presence.from}</span>
              {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                <input
                  type="text"
                  name={WEEKDAYS_NAME_ENG[day]}
                  id={WEEKDAYS_NAME_ENG[day]}
                  value={
                    presence.days
                      .find((d) => d.day === day)
                      ?.hours.toString() || '0'
                  }
                  className={clsx('w-12 p-1 text-center', {
                    'text-gray-400 bg-gray-200 border-gray-300': isBefore,
                  })}
                  disabled={isBefore}
                />
              ))}
              {/* <input
                type="text"
                name="monday"
                id="monday"
                value={
                  presence.days.find((d) => d.day === 1)?.hours.toString() ||
                  '0'
                }
                className="w-12 p-1"
              />
              <input
                type="text"
                name="tuesday"
                id="tuesday"
                value={
                  presence.days.find((d) => d.day === 2)?.hours.toString() ||
                  '0'
                }
              />
              <input
                type="text"
                name="wednesday"
                id="wednesday"
                value={
                  presence.days.find((d) => d.day === 3)?.hours.toString() ||
                  '0'
                }
              />
              <input
                type="text"
                name="thursday"
                id="thursday"
                value={
                  presence.days.find((d) => d.day === 4)?.hours.toString() ||
                  '0'
                }
              />
              <input
                type="text"
                name="friday"
                id="friday"
                value={
                  presence.days.find((d) => d.day === 5)?.hours.toString() ||
                  '0'
                }
              />
              <input
                type="text"
                name="saturday"
                id="saturday"
                value={
                  presence.days.find((d) => d.day === 6)?.hours.toString() ||
                  '0'
                }
              />
              <input
                type="text"
                name="sunday"
                id="sunday"
                value={
                  presence.days.find((d) => d.day === 0)?.hours.toString() ||
                  '0'
                }
              /> */}
            </div>
          );
        })}
      </Section>
      <Section caption="Rechten">
        <Form className="grid grid-cols-[minmax(200px,300px)_1fr] space-y-4 items-center text-[16px]">
          <label htmlFor="canViewEmploysees">Kan medewerkers zien</label>
          <input
            type="checkbox"
            name="canViewEmploysees"
            id="canViewEmploysees"
            checked={canViewEmployees}
          />
          <label htmlFor="canViewEmploysees">Nieuwe medewerker aanmaken</label>
          <input
            type="checkbox"
            name="canViewEmploysees"
            id="canViewEmploysees"
            checked={canCreateEmployee}
          />
        </Form>
      </Section>
    </div>
  );
}
