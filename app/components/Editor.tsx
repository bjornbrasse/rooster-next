import dayjs from 'dayjs';
import * as React from 'react';
import { useSchedule } from '~/contexts/schedule';

const Editor = () => {
  const { clearSelection, deleteItem, selection, setShowSelectionDrawer } =
    useSchedule();

  return (
    <>
      <button onClick={() => setShowSelectionDrawer(false)}>
        <i className="fas fa-times"></i>
      </button>
      <button onClick={() => clearSelection()} className="btn btn-delete">
        <i className="fas fa-times"></i>
      </button>
      {selection.map(({ id, date, task }) => (
        <div className="border border-blue-700" key={id}>
          <p>{dayjs(date).format("D-MM-'YY")}</p>
          <p>{task.name}</p>
          <button onClick={() => clearSelection()} className="btn btn-success">
            <i className="fas fa-map-pin"></i>
          </button>
          <button
            onClick={() => deleteItem({ bookingId: id })}
            className="btn btn-delete"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}
      <div className="border-2 border-slate-400">
        {/* {selection.reduce((acc: string[], { sel }) => {
                if (sel.date.toString() in acc) return acc;
                return acc.push(sel.date.toString());
              })} */}
      </div>
    </>
  );
};

export default Editor;
