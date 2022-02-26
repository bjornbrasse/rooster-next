import dayjs from 'dayjs';
import * as React from 'react';
import { useFetcher } from 'remix';
import { Booking } from '~/contexts/schedule';

interface IProps {
  booking: Booking;
  onDelete: ({ bookingId }: { bookingId: string }) => void;
}

const EditorItem: React.FC<IProps> = ({ booking, onDelete: deleteHandler }) => {
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      method="post"
      action="/_api/booking"
      className="border border-blue-700"
    >
      <input type="hidden" name="id" value={booking.id} />
      <input
        type="hidden"
        name="date"
        value={new Date(booking.date).toISOString()}
      />
      <input type="hidden" name="taskId" value={booking.task.id} />

      {/* <p>{dayjs(booking.date).format("D-MM-'YY")}</p> */}
      <p>{booking.task.name}</p>
      <button type="submit" className="btn btn-success">
        <i className="fas fa-map-pin"></i>
      </button>
      <button
        onClick={() => deleteHandler({ bookingId: booking.id ?? '' })}
        className="btn btn-delete"
      >
        <i className="fas fa-times"></i>
      </button>
    </fetcher.Form>
  );
};

export default EditorItem;
