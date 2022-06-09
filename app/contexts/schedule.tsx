import { Booking, Task } from '@prisma/client';
import * as React from 'react';
import useLocalStorage from '~/hooks/useLocalStorage';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

export type Moment = {
  date: Date;
  task: Task;
  bookings?: Booking[];
};

type TScheduleContext = {
  addToSelection: ({ date, task, bookings }: Moment) => void;
  clearSelection: () => void;
  // deleteItem: ({ bookingId }: { bookingId: string }) => void;
  removeFromSelection: ({ date, task }: Moment) => void;
  selection: Moment[];
  setShowSelectionDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  showSelectionDrawer: boolean;
};

export const ScheduleContext = React.createContext<TScheduleContext>({
  addToSelection() {},
  clearSelection() {},
  // deleteItem() {},
  removeFromSelection() {},
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
  const [selection, setSelection] = useLocalStorage<Moment[]>('selection', []);
  const [showSelectionDrawer, setShowSelectionDrawer] = useLocalStorage(
    'showSelectionDrawer',
    true,
  );

  const addToSelection = ({ date, task, bookings }: Moment) => {
    setSelection((prev) => [{ date, task, bookings }, ...prev]);
  };

  const clearSelection = () => {
    setSelection([]);
  };

  // const deleteItem = ({ bookingId }: { bookingId: string }) => {
  //   const newSelection = selection.filter(
  //     (booking) => booking.id !== bookingId
  //   );
  //   setSelection(newSelection);
  // };

  const removeFromSelection = ({ date, task }: Moment) => {
    const newSelection = selection.filter(
      (moment) =>
        dayjs(moment.date).date() !== dayjs(date).date() &&
        moment.task.id !== task.id,
    );
    setSelection(newSelection);
  };

  return (
    <ScheduleContext.Provider
      value={{
        addToSelection,
        clearSelection,
        // deleteItem,
        removeFromSelection,
        selection,
        setShowSelectionDrawer,
        showSelectionDrawer,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
