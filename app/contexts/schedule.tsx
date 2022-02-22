import { Task } from '@prisma/client';
import * as React from 'react';
import useLocalStorage from '~/hooks/useLocalStorage';

type Booking = {
  date: Date;
  task: Task;
  user: string;
};

type TScheduleContext = {
  addToSelection: ({ date, task, user }: Booking) => void;
  clearSelection: () => void;
  selection: Booking[];
  setShowSelectionDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  showSelectionDrawer: boolean;
};

const ScheduleContext = React.createContext<TScheduleContext>({
  addToSelection() {},
  clearSelection() {},
  selection: [],
  setShowSelectionDrawer() {},
  showSelectionDrawer: false,
});

export const useSchedule = () => {
  return React.useContext(ScheduleContext);
};

export const ScheduleProvider = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const [selection, setSelection] = useLocalStorage<Booking[]>('selection', []);
  const [showSelectionDrawer, setShowSelectionDrawer] = useLocalStorage(
    'showSelectionDrawer',
    true
  );

  const addToSelection = ({ date, task, user }: Booking) => {
    setSelection((prev) => [{ date, task, user }, ...prev]);
  };

  const clearSelection = () => {
    setSelection([]);
  };

  return (
    <ScheduleContext.Provider
      value={{
        addToSelection,
        clearSelection,
        selection,
        setShowSelectionDrawer,
        showSelectionDrawer,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
