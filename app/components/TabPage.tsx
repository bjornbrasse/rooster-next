import * as React from 'react';
import { Link, Outlet } from 'remix';
import schedule from '~/routes/_api/schedule';
import Container from './Container';

const TabPage: React.FC = () => {
  return (
    <Container padding={false}>
      <div id="header" className="flex border-b border-primary">
        <div id="tabs" className="mt-4 px-2 flex items-end">
          {tabs.map((tab) => (
            <Tab to={tab.to}>{tab.caption}</Tab>
          ))}
          {schedule && (
            <Tab to={`schedules/${schedule.id}`} className="pl-4 py-1">
              <p>{schedule.name}</p>
              <Link
                to={`/${organisationSlug}/${departmentSlug}/schedules/`}
                className="ml-4 mr-2"
              >
                <i className="fas fa-times"></i>
              </Link>
            </Tab>
          )}
        </div>
      </div>
      <Outlet />
    </Container>
  );
};

export default TabPage;
