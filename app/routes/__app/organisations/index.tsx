import { Organisation } from "@prisma/client";
import React from "react";
import { Link, LoaderFunction, useLoaderData, useNavigate } from "remix";
import { userIsAdmin } from "~/controllers/access.server";
import { db } from "~/utils/db.server";

type LoaderData = {
  organisations: Organisation[];
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  await userIsAdmin(request, "/home");

  const organisations = await db.organisation.findMany();

  return { organisations };
};

export default function Organisations() {
  const { organisations } = useLoaderData<LoaderData>();

  return (
    <div className="h-full flex flex-col">
      <div
        id="header"
        className="px-4 py-1 flex justify-between items-center bg-gray-300"
      >
        <h1>Organisaties</h1>
        <Link to="create" className="btn btn-save">
          <i className="fas fa-plus"></i>
        </Link>
      </div>
      <div className="flex-grow p-12">
        <table>
          <thead className="border-b-2 border-blue-800">
            <th>Organisatie</th>
            <th>Naam voluit</th>
            <th>Edit</th>
          </thead>
          <tbody>
            {organisations.map((organisation) => (
              <TRL
                to={organisation.id}
                className="border-b border-gray-300 hover:bg-blue-300 cursor-pointer"
                key={organisation.id}
              >
                <td>{organisation.nameShort}</td>
                <td>{organisation.name}</td>
                <td>
                  <i className="fas fa-pencil-alt"></i>
                </td>
              </TRL>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
