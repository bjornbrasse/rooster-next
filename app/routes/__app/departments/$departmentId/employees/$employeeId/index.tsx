import clsx from 'clsx';
import dayjs from 'dayjs';
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
  const { canCreateEmployee, canViewEmployees, canDeleteEmployee, user } =
    departmentEmployee;

  const { canCreateTask, canViewTasks } = departmentEmployee;

  return (
    <div className="p-2 flex flex-col space-y-6">
      <Section caption="Algemeen">
        <span>{`${user.firstName} ${user.lastName}`}</span>
      </Section>
      <Section caption="Aanwezigheid">
        {departmentEmployee.presences.length === 0 ? (
          <div className="flex items-center">
            <span>Er is nog geen standaard planning</span>
            <button className="btn btn-save ml-6">Toevoegen</button>
          </div>
        ) : (
          <>
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
                </div>
              );
            })}
          </>
        )}
      </Section>
      <Section caption="Rechten">
        <Form className="grid grid-cols-[minmax(200px,300px)_1fr] space-y-2 items-center text-[16px]">
          <span className="pt-2 col-span-2 border-b border-slate-400">
            Medewerkers
          </span>
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
          <label htmlFor="canDeleteEmployee">Verwijderen</label>
          <input
            type="checkbox"
            name="canDeleteEmployee"
            id="canDeleteEmployee"
            checked={canDeleteEmployee}
          />
          <span className="pt-2 col-span-2 border-b border-slate-400">
            Taken
          </span>
          <label htmlFor="canViewTasks">Lijst weergeven</label>
          <input
            type="checkbox"
            name="canViewTasks"
            id="canViewTasks"
            checked={canViewTasks}
          />
          <label htmlFor="canViewTask">Nieuwe maken</label>
          <input
            type="checkbox"
            name="canViewTask"
            id="canViewTask"
            checked={canCreateTask}
          />
        </Form>
      </Section>
    </div>
  );
}
