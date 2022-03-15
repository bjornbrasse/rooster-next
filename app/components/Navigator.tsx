import { Department, Organisation } from "@prisma/client";
import * as React from "react";
import { Link } from "remix";

const Navigator: React.FC<{
  caption?: string;
  organisation?: Organisation;
  organisationTo?: string;
  department?: Department;
}> = ({ caption, department, organisation, organisationTo }) => {
  return (
    <div id="Navigator" className="px-4 py-1 flex items-center bg-gray-300">
      {caption && <span>{caption}</span>}
      {organisation && (
        <>
          <Link to={organisationTo ?? `/organisations`}>
            {organisation?.name}
          </Link>
          {department && (
            <>
              <i className="fas fa-chevron-right mx-2 text-sm" />
              <Link to={`/organisations/${organisation.id}/departments`}>
                {department.name}
              </Link>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Navigator;
