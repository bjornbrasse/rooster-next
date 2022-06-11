import { useEffect, useRef, useState } from 'react';
import { Appointment } from '@prisma/client';
import { useFetcher } from 'remix';
import { ActionData as AppointmentData } from '~/routes/_api/appointment';
import { DatePicker, links as datePickerLinks } from '../date-picker';
import dayjs from 'dayjs';
import { LoaderData as MeetingLoaderData } from '~/routes/_api/meeting';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';

export const links = () => [...datePickerLinks()];

export function AppointmentForm({
  date,
  onSaved: savedHandler,
  appointment,
}: {
  date: Date;
  onSaved: (appointment: Appointment) => void;
  redirectTo?: string;
  appointment?: Appointment;
}) {
  const fetcher = useFetcher<AppointmentData>();
  const meetingFetcher = useFetcher<MeetingLoaderData>();
  const focusRef = useRef<HTMLInputElement>(null);
  const [start, setStart] = useState(dayjs(date).startOf('hour').toDate());
  const [end, setEnd] = useState(
    dayjs(date).startOf('hour').add(45, 'minute').toDate(),
  );

  useEffect(() => {
    meetingFetcher.load('/_api/meeting');
  }, []);

  // useEffect(() => {
  //   if (focusRef?.current) {
  //     focusRef.current?.focus();
  //   }
  // }, [focusRef]);

  // useEffect(() => {
  //   if (fetcher.data?.appointment) {
  //     savedHandler(fetcher.data.appointment);
  //     // return setTimeout(() => closeDialog(), 100);
  //   }
  // }, [fetcher]);

  return (
    <fetcher.Form
      method="post"
      action="/_api/appointment"
      className="flex flex-col"
    >
      <input type="hidden" name="appointmentId" value={appointment?.id} />
      <input type="hidden" name="start" value={start.toISOString()} />
      <input type="hidden" name="end" value={end.toISOString()} />

      <label htmlFor="name" className="mt-0">
        Naam
        <input
          type="text"
          name="name"
          id="name"
          ref={focusRef}
          className="w-full"
        />
      </label>
      {fetcher.data?.errors?.fieldErrors.name ? (
        <p className="error">Fout - {fetcher.data?.errors?.fieldErrors.name}</p>
      ) : (
        <p>{` `}</p>
      )}
      {/* <Combobox
        ariaLabel={''}
        data={
          meetingFetcher.data?.meetings.map((meeting) => ({
            caption: meeting.name,
            value: meeting.id,
          })) ?? []
        }
        onSelect={function (value: string): void {
          throw new Error('Function not implemented.');
        }}
      /> */}
      <Combobox aria-label="choose a meeting" openOnFocus>
        <ComboboxInput />
        <ComboboxPopover>
          <ComboboxList className="bg-red-400">
            <ComboboxOption value="Apple" />
            <ComboboxOption value="Banana" />
            {/* {meetingFetcher.data?.meetings.map((meeting) => (
              <ComboboxOption value={meeting.name} key={meeting.id} />
            ))} */}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
      <fieldset className="my-8 flex space-x-2">
        <label htmlFor="fromDate">
          Datum
          <DatePicker
            id="fromDate"
            date={start}
            dateFormat="d MMMM yyyy"
            onChange={(date: Date) => setStart(date)}
            className="w-48"
          />
        </label>
        <label htmlFor="fromTime">
          Start
          <DatePicker
            id="fromTime"
            name="fromTime"
            date={start}
            dateFormat="HH:mm"
            onChange={(date: Date) => {
              const div = dayjs(end).diff(start, 'minutes');
              console.log('div', div);
              setStart(date);
              setEnd(dayjs(date).add(div, 'minutes').toDate());
            }}
            popperModifiers={[
              {
                name: 'offset',
                options: {
                  offset: [10, -10],
                },
              },
            ]}
            showTimeSelect
            showTimeSelectOnly
            className="w-24"
          />
        </label>
        <label htmlFor="toTime">
          Einde
          <DatePicker
            id="toTime"
            name="toTime"
            date={end}
            dateFormat="HH:mm"
            onChange={(date: Date) => setEnd(date)}
            showTimeSelect
            showTimeSelectOnly
            popperModifiers={[
              {
                name: 'offset',
                options: {
                  offset: [10, -10],
                },
              },
            ]}
            className="w-24"
          />
        </label>
      </fieldset>
      <button type="submit" className="btn btn-save">
        Opslaan
      </button>
    </fetcher.Form>
  );
}
