import { FC } from 'react';

interface IProps {
  flex?: 'flex-row' | 'flex-col';
  padding?: boolean;
}

export const Container: FC<IProps & JSX.IntrinsicElements['div']> = (props) => {
  return (
    <div
      // {...(props as JSX.IntrinsicElements['div'])}
      className={`h-full w-full ${props?.padding ? 'px-12 py-8' : null} flex ${
        props?.flex ?? 'flex-row'
      }`}
    >
      {props.children}
    </div>
  );
};
