import clsx from 'clsx';
import dayjs from 'dayjs';
import { Form, useLoaderData } from 'remix';
import {
  PresenceForm,
  links as presenceFormLinks,
} from '~/components/forms/presence-form';
import { Section } from '~/components/section';
import { useDialog } from '~/contexts/dialog';
import { getDepartmentEmployee } from '~/controllers/department';
import { BBLoader } from '~/types';
import { WEEKDAYS } from '~/utils/date';

export const links = () => [...presenceFormLinks()];

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

export default function DepartmentEmployee() {
  const { departmentEmployee } = useLoaderData() as LoaderData;
  const { closeDialog, openDialog } = useDialog();

  const { canCreateEmployee, canViewEmployees, canDeleteEmployee, user } =
    departmentEmployee;
  const { canCreateTask, canViewTasks } = departmentEmployee;

  return (
    <div className="flex flex-col space-y-6 p-2">
      <Section caption="Algemeen">
        <span>{`${user.firstName} ${user.lastName}`}</span>
      </Section>
      <Section caption="Aanwezigheid">
        {departmentEmployee.departmentPresences.length === 0 ? (
          <div className="flex items-center">
            <span>Er is nog geen standaard planning</span>
            <button
              onClick={() =>
                openDialog(
                  'Toevoegen',
                  <PresenceForm
                    departmentEmployeeId={departmentEmployee.id}
                    onSaved={() => closeDialog()}
                  />,
                  '',
                )
              }
              className="btn btn-save ml-6"
            >
              Toevoegen
            </button>
          </div>
        ) : (
          <>
            <div className="mb-1 grid grid-cols-[minmax(200px,300px)_56px_56px_56px_56px_56px_56px_56px] justify-start space-x-2">
              <p>Vanaf</p>
              {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                <label htmlFor={WEEKDAYS_NAME_ENG[day]} className="text-center">
                  {WEEKDAYS_ABBR_NL[day]}
                </label>
              ))}
            </div>
            {departmentEmployee.departmentPresences.map((presence) => {
              const isBefore = dayjs(presence.from).isBefore(dayjs(), 'day');

              return (
                <div className="grid grid-cols-[minmax(200px,300px)_56px_56px_56px_56px_56px_56px_56px] items-center space-x-2 space-y-2">
                  <span>{presence.from}</span>
                  {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                    <input
                      type="text"
                      name={WEEKDAYS_NAME_ENG[day]}
                      id={WEEKDAYS_NAME_ENG[day]}
                      value={
                        presence.departmentPresenceDays
                          .find((d) => d.day === day)
                          ?.hours.toString() || '0'
                      }
                      className={clsx('w-12 p-1 text-center', {
                        'border-gray-300 bg-gray-200 text-gray-400': isBefore,
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
        <Form className="grid grid-cols-[minmax(200px,300px)_1fr] items-center space-y-2 text-[16px]">
          <span className="col-span-2 border-b border-slate-400 pt-2">
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
          <span className="col-span-2 border-b border-slate-400 pt-2">
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
