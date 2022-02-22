import * as React from 'react';
import axios from 'axios';
// import { ApolloError, useLazyQuery, useQuery } from '@apollo/client';
// import { TIMETABLE_QUERY } from '@/graphql/queries/timetable.q';
// import {
//   TimetableQuery,
//   TimetableQueryVariables,
//   TimetableQuery_timetable,
//   TimetableQuery_timetable_tasks,
// } from '@/graphql/generated/TimetableQuery';
import dayjs, { Dayjs } from 'dayjs';
import { UseQueryResult } from 'react-query';
import { useQuery } from 'react-query';
import { Timetable, TimetableQueryResponse } from 'pages/api/timetables/[id]';
import { useFetchTimetable } from '@/hooks/useFetchTimetable';
// export type DayTask = {
//   id: string;
//   day: Dayjs;
//   task: TimetableQuery_timetable_tasks;
// };

const fetchTimetables = async () => {
  const { data } = await axios.get<Timetable[]>('/api/timetables');
  return data;
};

type TTimetableContext = {
  timetable: Timetable | null;
  selectTimetable: (timetableId: string) => void;
  // saveTimetable: (name: string, nameShort: string) => void;
};

// type View = 'day' | 'workweek' | 'week' | 'month';
// const [view, setView] = React.useState<View>('workweek');

const TimetableContext = React.createContext<TTimetableContext>(null);

export function useTimetable() {
  return React.useContext(TimetableContext);
}

export const TimetableProvider = ({ children }) => {
  const [timetableId, setTimetableId] = React.useState<string>(
    'cktv6oszk0003nkzg7cunewir'
  );
  const [timetable, setTimetable] = React.useState<Timetable>(null);

  // const { data } = useFetchTimetable(timetableId);

  // const res = useQuery<Timetable[]>('timetables', fetchTimetables);

  // const fetchTimetable = useFetchTimetable(activeTimetableId);

  // const [getTimetable, { data, loading, error }] = useLazyQuery<
  //   TimetableQuery,
  //   TimetableQueryVariables
  // >(TIMETABLE_QUERY);

  // async function fetchTimetable(timetableId: string) {
  //   const { data } = await axios.get<TimetableQueryResponse>(
  //     `/api/timetables/${timetableId}`
  //   );
  //   return data;
  // }

  // const {} = useQuery('timetable', fetchTimetable, {});

  // async function saveTimetable(name: string, nameShort: string) {
  //   try {
  //     const response = await fetch('/api/timetables/create', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ name, nameShort }),
  //     });
  //     return await response.json();
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  // }

  const selectTimetable = (timetableId: string) => {
    setTimetableId(timetableId);
  };

  // React.useEffect(() => {
  //   selectTimetable('cktv6oszk0003nkzg7cunewir');
  // }, []);

  return (
    <TimetableContext.Provider
      value={{
        // timetable: data?.timetable || null,
        timetable: null,
        selectTimetable,
        // timetableResult: [data?.timetable, loading, error],
        // saveTimetable,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};
