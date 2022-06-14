import * as React from 'react';
import { Link } from 'remix';
import { Breadcrumb } from '~/types';

interface IProps {
  breadcrumbs: Breadcrumb[];
}

export const Breadcrumbs: React.FC<IProps> = ({ breadcrumbs }) => {
  return (
    <div id="Breadcrumbs" className="flex items-center bg-gray-300 px-4 py-1">
      {breadcrumbs.map(({ caption, href }, index) => (
        <Link to={typeof href === 'string' ? href : href()} key={index}>
          {caption}
        </Link>
      ))}
    </div>
  );
};
