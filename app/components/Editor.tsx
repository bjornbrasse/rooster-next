import dayjs from 'dayjs';
import * as React from 'react';
import { Moment } from '~/contexts/schedule';
import { useSchedule } from '~/hooks/useSchedule';
import { MONTHS, WEEKDAYS } from '~/utils/date';
import EditorItem from './EditorItem';

const Editor = () => {
  const {
    clearSelection,
    removeFromSelection,
    selection,
    setShowSelectionDrawer,
  } = useSchedule();

  const sel = React.useMemo(() => {
    return selection
      .sort((a, b) => (a.date < b.date ? -1 : 0))
      .reduce(
        (map, e) => map.set(e.date, [...(map.get(e.date) || []), e]),
        new Map<Date, Moment[]>()
      );
  }, [selection]);

  return (
    <>
      <button onClick={() => setShowSelectionDrawer(false)}>
        <i className="fas fa-times"></i>
      </button>
      <button onClick={() => clearSelection()} className="btn btn-delete">
        <i className="fas fa-times"></i>
      </button>
      <div className="border-2 border-slate-400">
        {Array.from(sel).map(([date, moments], index) => (
          <div key={index}>
            <p className="bg-gray-200" key={index}>{`${
              WEEKDAYS[dayjs(date).day()].name
            } ${dayjs(date).date()} ${MONTHS[dayjs(date).month()].name} ${dayjs(
              date
            ).year()}`}</p>
            {moments
              .sort((a, b) => (a.task.name < b.task.name ? -1 : 0))
              .map((moment) => (
                <EditorItem
                  moment={moment}
                  onDelete={removeFromSelection}
                  key={`${new Date(moment.date).toISOString()}-${
                    moment.task.id
                  }`}
                />
              ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Editor;
