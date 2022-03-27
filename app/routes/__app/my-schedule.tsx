import React from 'react';
import { date } from 'zod';
import useLocalStorage from '~/hooks/useLocalStorage';

export default function MySchedule() {
  const [] = useLocalStorage('current', new Date());
  return <div className="h-full bg-red-500">my-schedule</div>;
}
