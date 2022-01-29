import * as React from 'react';
import { ErrorBoundaryComponent, json } from 'remix';

export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export const badRequest = <T>(data: T) => json(data, { status: 400 });

// export const showEBC =
//   (error: Error, pathName: string): ErrorBoundaryComponent =>
//   ({ error }) => {
//     console.error(error);
//     return (
//       <div>
//         <h1>{`Something went wrong in path [${pathName}]`}</h1>
//         <pre>{JSON.stringify(error, null, 2)}</pre>
//       </div>
//     );
//   };
