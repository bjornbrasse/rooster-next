import dayjs from 'dayjs';
import * as React from 'react';
import { Booking } from '~/contexts/schedule';
import task from '~/routes/_api/task';

interface IProps {
  booking: Booking;
  onDelete: ({ bookingId }: { bookingId: string }) => void;
}

const EditorItem: React.FC<IProps> = ({ booking, onDelete: deleteHandler }) => {
  return (
    <div className="border border-blue-700" key={booking.id}>
      {/* <p>{dayjs(booking.date).format("D-MM-'YY")}</p> */}
      <p>{booking.task.name}</p>
      <button
        onClick={() => console.log('nog maken')}
        className="btn btn-success"
      >
        <i className="fas fa-map-pin"></i>
      </button>
      <button
        onClick={() => deleteHandler({ bookingId: booking.id ?? '' })}
        className="btn btn-delete"
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default EditorItem;
