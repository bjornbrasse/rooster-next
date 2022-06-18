import { FC, useEffect, useRef, useState } from 'react';
import { useFetcher } from 'remix';
import { ActionData } from '~/routes/_api/task';
import { Field } from '../form-elements';
import { DatePicker, links as datePickerLinks } from '../date-picker';
// import { FetcherWithComponents } from '@remix-run/react/components';
import { SketchPicker } from 'react-color';

export const links = () => [...datePickerLinks()];

type IProps = {
  // fetcher: FetcherWithComponents<any>;
  onSaved: () => void;
  specialDate?: {
    color?: string;
    date: Date;
    description?: string;
    id: string;
    name: string;
  };
};

export const SpecialDateForm: FC<IProps> = ({
  onSaved: savedHandler,
  specialDate,
}) => {
  const [date, setDate] = useState(
    specialDate?.date ? new Date(specialDate.date) : new Date(),
  );
  const fetcher = useFetcher<ActionData>();
  const focusRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusRef?.current) {
      focusRef.current?.focus();
    }
  }, [focusRef]);

  useEffect(() => {
    if (fetcher.data?.success) {
      savedHandler();
    }
  }, [fetcher]);

  return (
    <fetcher.Form method="post" action={`/_api/special-date`} noValidate>
      <input type="hidden" name="id" value={specialDate?.id} />
      <fieldset className="flex flex-col">
        <DatePicker
          id="date"
          date={date}
          name="date"
          onChange={(date: Date) => setDate(date)}
        />
        <Field
          name="name"
          label="Naam"
          defaultValue={specialDate?.name ?? ''}
        />
        <Field
          name="description"
          label="Omschrijving"
          defaultValue={specialDate?.description ?? ''}
          type={'textarea'}
          rows={10}
        />
        <SketchPicker onChange={(color) => console.log('kleur:', color)} />
      </fieldset>
      <button className="btn btn-save" type="submit">
        Opslaan
      </button>
    </fetcher.Form>
  );
};
