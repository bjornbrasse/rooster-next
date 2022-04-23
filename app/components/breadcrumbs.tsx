import * as React from 'react';
import { Link } from 'remix';
import { Breadcrumb } from '~/types';

export const Breadcrumbs: React.FC<{
  breadcrumbs: Array<{ caption: string; to: string }>;
}> = ({ breadcrumbs }) => {
  return (
    <div id="Breadcrumbs" className="flex items-center bg-gray-300 px-4 py-1">
      {breadcrumbs.map((bc, index) => (
        <Link to={bc.to} key="index">
          {bc.caption}
        </Link>
      ))}
    </div>
  );
};
