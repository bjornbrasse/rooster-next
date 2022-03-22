import * as React from 'react';
import ReactDatePicker from 'react-datepicker';
import styles from '~/../node_modules/react-datepicker/dist/react-datepicker.css';

interface IProps {
  id: string;
  date: Date | null;
  name: string;
  onChange: (date: Date) => void;
}

export const links = () => [{ rel: 'stylesheet', href: styles }];

export const DatePicker: React.FC<IProps> = ({
  id,
  date,
  name,
  onChange: changeHandler,
}) => {
  return (
    <ReactDatePicker
      id={id}
      name={name}
      selected={date}
      onChange={changeHandler}
      dateFormat="dd-MM-yyyy"
    />
  );
};
