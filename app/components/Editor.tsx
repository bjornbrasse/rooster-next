import dayjs from 'dayjs';
import * as React from 'react';
import { Booking, useSchedule } from '~/contexts/schedule';
import { MONTHS, WEEKDAYS } from '~/utils/date';
import EditorItem from './EditorItem';

const Editor = () => {
  const { clearSelection, deleteItem, selection, setShowSelectionDrawer } =
    useSchedule();

  const sel = React.useMemo(() => {
    return selection
      .sort((a, b) => (a.date < b.date ? -1 : 0))
      .reduce(
        (map, e) => map.set(e.date, [...(map.get(e.date) || []), e]),
        new Map<Date, Booking[]>()
      );
  }, selection);

  return (
    <>
      <button onClick={() => setShowSelectionDrawer(false)}>
        <i className="fas fa-times"></i>
      </button>
      <button onClick={() => clearSelection()} className="btn btn-delete">
        <i className="fas fa-times"></i>
      </button>
      <div className="border-2 border-slate-400">
        {Array.from(sel).map(([date, bookings], index) => (
          <>
            <p className="bg-gray-200" key={index}>{`${
              WEEKDAYS[dayjs(date).day()].name
            } ${dayjs(date).date()} ${MONTHS[dayjs(date).month()].name} ${dayjs(
              date
            ).year()}`}</p>
            {bookings
              .sort((a, b) => (a.task.name < b.task.name ? -1 : 0))
              .map((booking) => (
                <EditorItem
                  booking={booking}
                  onDelete={deleteItem}
                  key={booking.id}
                />
              ))}
          </>
        ))}
      </div>
    </>
  );
};

export default Editor;
