import * as React from 'react';
import { useFetcher } from 'remix';
import { ActionData } from '~/routes/_api/presence';
import PresenceGrid from '../presence-grid';
import {
  DatePicker,
  links as dateSelectorLinks,
} from '~/components/date-picker';

export const links = () => [...dateSelectorLinks()];

export const PresenceForm: React.FC<{
  departmentEmployeeId: string;
  onSaved: () => void;
}> = ({ departmentEmployeeId, onSaved: savedHandler }) => {
  const fetcher = useFetcher<ActionData>();
  const [from, setFrom] = React.useState(new Date());

  React.useEffect(() => {
    if (fetcher.data?.departmentPresence) {
      savedHandler();
    }
  }, [fetcher]);

  return (
    <fetcher.Form method="post" action="/_api/presence">
      <input
        type="hidden"
        name="departmentEmployeeId"
        value={departmentEmployeeId}
      />
      {/* <input type="hidden" name="organisationId" value={organisationId} /> */}

      <fieldset className="flex flex-col">
        <DatePicker
          id="from"
          name="from"
          date={from}
          onChange={(date: Date) => setFrom(date)}
        />

        <PresenceGrid departmentPresenceDays={undefined} />
      </fieldset>
      <button type="submit" className="btn btn-save">
        Opslaan
      </button>
    </fetcher.Form>
  );
};
