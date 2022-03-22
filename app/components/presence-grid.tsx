import { DepartmentPresenceDay } from '@prisma/client';
import clsx from 'clsx';
import * as React from 'react';
import { WEEKDAYS } from '~/utils/date';

const WEEKDAYS_NAME_ENG = WEEKDAYS.map((d) => d.name.eng);
const WEEKDAYS_ABBR_NL = WEEKDAYS.map((d) => d.abbr.nl);

const PresenceGrid: React.FC<{
  departmentPresenceDays?: DepartmentPresenceDay[];
}> = ({ departmentPresenceDays }) => {
  return (
    <>
      <div className="mb-1 grid grid-cols-[56px_56px_56px_56px_56px_56px_56px] justify-start space-x-2">
        {[1, 2, 3, 4, 5, 6, 0].map((day) => (
          <label htmlFor={WEEKDAYS_NAME_ENG[day]} className="text-center">
            {WEEKDAYS_ABBR_NL[day]}
          </label>
        ))}
        {[1, 2, 3, 4, 5, 6, 0].map((day) => (
          <input
            type="text"
            name={WEEKDAYS_NAME_ENG[day]}
            id={WEEKDAYS_NAME_ENG[day]}
            defaultValue={
              departmentPresenceDays
                ?.find((d) => d.day === day)
                ?.hours.toString() || '0'
            }
            className={clsx('w-12 p-1 text-center', {
              'border-gray-300 bg-gray-200 text-gray-400': true,
            })}
          />
        ))}
      </div>
    </>
  );
};

export default PresenceGrid;
