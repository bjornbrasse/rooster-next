import * as React from 'react';
import { ScheduleContext } from '~/contexts/schedule';

export const useSchedule = () => {
  return React.useContext(ScheduleContext);
};
