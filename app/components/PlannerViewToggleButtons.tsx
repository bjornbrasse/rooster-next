import * as React from 'react';
import { useLocation, useSearchParams, useSubmit } from 'remix';

const Button: React.FC<{ isActive: boolean; onClick: () => void }> = ({
  children,
  isActive,
  onClick: clickHandler,
}) => {
  return (
    <button
      onClick={clickHandler}
      className={`p-2 ${isActive ? 'bg-red-400' : 'bg-blue-400'}`}
    >
      {children}
    </button>
  );
};

export type View = 'day' | 'week' | 'month';

export default function PlannerViewToggleButtons({ view }: { view: View }) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const submit = useSubmit();

  function setViewHandler(view: View) {
    searchParams.set('v', view);
    submit(null, { action: `${location.pathname}?${searchParams}` });
  }

  return (
    <>
      <Button onClick={() => setViewHandler('day')} isActive={view === 'day'}>
        D
      </Button>
      <Button onClick={() => setViewHandler('week')} isActive={view === 'week'}>
        W
      </Button>
      <Button
        onClick={() => setViewHandler('month')}
        isActive={view === 'month'}
      >
        M
      </Button>
    </>
  );
}
