import dayjs from 'dayjs';
import * as React from 'react';
import { useFetcher } from 'remix';
import { Moment } from '~/contexts/schedule';

interface IProps {
  moment: Moment;
  onDelete: ({ date, task }: Moment) => void;
}

const EditorItem: React.FC<IProps> = ({ moment, onDelete: deleteHandler }) => {
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      method="post"
      action="/_api/booking"
      className="border border-blue-700"
    >
      <input
        type="hidden"
        name="id"
        value={new Date(moment.date).toISOString()}
      />
      <input
        type="hidden"
        name="date"
        value={new Date(moment.date).toISOString()}
      />
      <input type="hidden" name="taskId" value={moment.task.id} />

      {/* <p>{dayjs(moment.date).format("D-MM-'YY")}</p> */}
      <p>{moment.task.name}</p>
      <button type="submit" className="btn btn-success">
        <i className="fas fa-map-pin"></i>
      </button>
      <button
        onClick={() => deleteHandler({ date: moment.date, task: moment.task })}
        className="btn btn-delete"
      >
        <i className="fas fa-times"></i>
      </button>
    </fetcher.Form>
  );
};

export default EditorItem;
