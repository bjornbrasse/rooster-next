import { FC, useEffect, useRef, useState } from 'react';
import { useFetcher } from 'remix';
import { ActionData } from '~/routes/_api/task';
import { Field } from '../form-elements';
import { DatePicker, links as datePickerLinks } from '../date-picker';
// import { FetcherWithComponents } from '@remix-run/react/components';
import { SketchPicker } from 'react-color';
import { usePopper } from 'react-popper';
import clsx from 'clsx';
import { Portal } from '../portal';

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
  const [color, setColor] = useState(specialDate?.color ?? '#ffffff');
  const [date, setDate] = useState(
    specialDate?.date ? new Date(specialDate.date) : new Date(),
  );
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>();
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>();

  const fetcher = useFetcher<ActionData>();
  const focusRef = useRef<HTMLInputElement>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
  });

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
    <>
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
            rows={6}
          />
          <button
            className="align-center align-self-end flex h-10 w-12 justify-center rounded-md border border-gray-300 p-1"
            onClick={(e) => {
              e.stopPropagation();
              setShowColorPicker((v) => !v);
            }}
            ref={setReferenceElement}
            type="button"
          >
            <div
              className="h-4 w-4 rounded-md border border-gray-300 p-4"
              style={{ backgroundColor: color }}
            />
          </button>
        </fieldset>
        <button className="btn btn-save" type="submit">
          Opslaan
        </button>
      </fetcher.Form>
      {showColorPicker && (
        <Portal>
          <div
            {...attributes}
            className="z-50 border-4 border-red-400 p-4"
            ref={setPopperElement}
            style={styles.popper}
            onClick={(e) => {
              console.log('komt hier?');
              e.stopPropagation();
            }}
          >
            <SketchPicker
              color={color}
              // onChange={(color, event) => {
              //   event.stopPropagation();
              //   setColor(color.hex);
              //   console.log('dit is de kleur', color.hex);
              // }}
              onChangeComplete={(color, event) => {
                event.stopPropagation();
                setColor(color.hex);
                console.log('uiteindelijke kleur', color.hex);
              }}
            />
          </div>
        </Portal>
      )}
    </>
  );
};
