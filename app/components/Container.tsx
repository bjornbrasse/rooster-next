import { FC } from 'react';

interface IProps {
  flex?: 'flex-row' | 'flex-col';
  padding?: 'p-0';
}

export const Container: FC<IProps & JSX.IntrinsicElements['div']> = (props) => {
  return (
    <div
      {...(props as JSX.IntrinsicElements['div'])}
      className={`h-full w-full ${props?.padding ?? 'px-12 py-8'} ${
        props?.flex ? `flex ${props.flex}` : null
      }`}
    >
      {props.children}
    </div>
  );
};
