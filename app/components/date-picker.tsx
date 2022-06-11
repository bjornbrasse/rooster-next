import * as React from 'react';
import ReactDatePicker from 'react-datepicker';
import styles from '~/../node_modules/react-datepicker/dist/react-datepicker.css';

interface IProps {
  id: string;
  className?: string;
  date: Date | null;
  dateFormat?: string;
  name: string;
  onChange: (date: Date) => void;
}

export const links = () => [{ rel: 'stylesheet', href: styles }];

export const DatePicker: React.FC<IProps> = ({
  id,
  className,
  date,
  dateFormat = 'dd-MM-yyyy',
  name,
  onChange: changeHandler,
}) => {
  return (
    <ReactDatePicker
      id={id}
      className={className}
      name={name}
      selected={date}
      onChange={changeHandler}
      dateFormat={dateFormat}
    />
  );
};
