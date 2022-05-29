import { Department, Schedule } from '@prisma/client';
import * as React from 'react';
import {
  Link,
  LoaderFunction,
  NavLink,
  Outlet,
  redirect,
  useMatches,
  useParams,
} from 'remix';
import { Container } from '~/components/container';
import { getDepartment } from '~/controllers/department';
import { getSchedules } from '~/controllers/schedule.server';

type LoaderData = {
  department: Department;
  schedules: Schedule[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const department = await getDepartment({
    departmentSlug: String(params.departmentSlug),
  });

  if (!department) return redirect('/');

  const schedules = await getSchedules({ departmentId: department?.id });

  return { department, schedules };
};

const Tab: React.FC<{ className?: string; to: string }> = ({
  children,
  className,
  to,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `mx-1 flex p-2 ${
          isActive ? 'bg-primary text-accent' : 'bg-gray-300'
        } rounded-t-lg ${className}`
      }
    >
      {children}
    </NavLink>
  );
};

export default function DepartmentLayout() {
  const { departmentSlug, organisationSlug, scheduleId } = useParams();

  const tabs: { caption: string; to: string }[] = [
    { caption: 'Algemeen', to: `/${organisationSlug}/${departmentSlug}/` },
    { caption: 'Medewerkers', to: 'employees/' },
    { caption: 'Roosters', to: 'schedules/' },
  ];

  const data = useMatches().find(
    (m) =>
      m.pathname ===
      `/${organisationSlug}/${departmentSlug}/schedules/${scheduleId}`,
  )?.data as { schedule: Schedule };

  const schedule = data?.schedule;

  return (
    <Container padding={false}>
      <div id="header" className="flex border-b border-primary">
        <div id="tabs" className="mt-4 flex items-end px-2">
          {tabs.map((tab) => (
            <Tab to={tab.to}>{tab.caption}</Tab>
          ))}
          {schedule && (
            <Tab to={`schedules/${schedule.id}`} className="py-1 pl-4">
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
}
