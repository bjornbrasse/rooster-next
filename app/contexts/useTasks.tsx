import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
// import { TimetableQuery_timetable_tasks } from '@/graphql/generated/TimetableQuery';
// import { PlannedTask } from '@/graphql/types/plannedTask.t';
import { tasks } from 'data/tasks';

type DayTask = {
  id: string;
  day: Dayjs;
  task: TimetableQuery_timetable_tasks;
};

type TTasksContext = {
  activeDayTask: DayTask;
  deselectDayTask: (id: string) => void;
  selectChange: (dayTask: DayTask) => void;
  selectDayTask: (dayTask: DayTask, e: React.SyntheticEvent) => void;
  selectedDayTasks: DayTask[];
};

const TasksContext = React.createContext<TTasksContext>(null);

export function useTasks() {
  return React.useContext(TasksContext);
}

export const TasksProvider = ({ children }) => {
  const [selectedDayTasks, setSelectedDayTasks] = React.useState<DayTask[]>([]);
  // const {
  //   data: daysData,
  //   loading: daysLoading,
  //   error: daysError,
  //   refetch: daysRefetch,
  // } = useQuery<getDaysQuery, getDaysQueryVariables>(GET_DAYS_QUERY, {
  //   variables: { from: '2021-10-04', to: '2021-10-08' },
  // });

  const deselectDayTask = (id: string) => {
    setSelectedDayTasks(selectedDayTasks.filter((dt) => dt.id !== id));
  };

  const selectChange = (dayTask: DayTask) => {
    const updated = [...selectedDayTasks.filter((dt) => dt.id !== dayTask.id)];
    updated.unshift(dayTask);
    setSelectedDayTasks(updated);
  };

  function selectDayTask(dayTask: DayTask, e: React.MouseEvent) {
    if (e.shiftKey) {
      return setSelectedDayTasks(() => [dayTask]);
    }
    const alreadySelected =
      selectedDayTasks.findIndex((dt) => dt.id === dayTask.id) > -1;
    if (alreadySelected) {
      setSelectedDayTasks(
        selectedDayTasks.filter((dt) => dt.id !== dayTask.id)
      );
    } else {
      // setSelectedDayTasks([dayTask, ...selectedDayTasks]);
      const updated = [...selectedDayTasks];
      updated.unshift(dayTask);
      setSelectedDayTasks(updated);
    }
    // } else {
    //   setSelectedDayTasks([dayTask]);
    // }
  }

  return (
    <TasksContext.Provider
      value={{
        activeDayTask: {
          ...selectedDayTasks[0],
          // id: `${selectedDayTasks[0]?.day.format('YYYYMMDD')}-${
          //   selectedDayTasks[0]?.task?._id
          // }`,
        },
        deselectDayTask,
        selectChange,
        selectDayTask,
        selectedDayTasks: selectedDayTasks.map((dt) => ({
          ...dt,
          id: `${dt.day.format('YYYYMMDD')}-${dt.task._id}`,
        })),
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
