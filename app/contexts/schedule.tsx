import { Task } from '@prisma/client';
import * as React from 'react';
import useLocalStorage from '~/hooks/useLocalStorage';
import { nanoid } from 'nanoid';

type Booking = {
  id: string;
  date: Date;
  task: Task;
  user: string;
};

type TScheduleContext = {
  addToSelection: ({ date, task, user }: Booking) => void;
  clearSelection: () => void;
  deleteItem: ({ bookingId }: { bookingId: string }) => void;
  selection: Booking[];
  setShowSelectionDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  showSelectionDrawer: boolean;
};

const ScheduleContext = React.createContext<TScheduleContext>({
  addToSelection() {},
  clearSelection() {},
  deleteItem() {},
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
    setSelection((prev) => [{ id: nanoid(), date, task, user }, ...prev]);
  };

  const clearSelection = () => {
    setSelection([]);
  };

  const deleteItem = ({ bookingId }: { bookingId: string }) => {
    const newSelection = selection.filter(
      (booking) => booking.id !== bookingId
    );
    setSelection(newSelection);
  };

  return (
    <ScheduleContext.Provider
      value={{
        addToSelection,
        clearSelection,
        deleteItem,
        selection,
        setShowSelectionDrawer,
        showSelectionDrawer,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
