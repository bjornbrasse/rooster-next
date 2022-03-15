import { Department, Organisation } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import { redirect } from "remix";
import { Outlet, useParams } from "remix";
import Menu from "~/components/Menu";
import Navigator from "~/components/Navigator";
import Tabs from "~/components/Tabs";
import { getDepartment } from "~/controllers/department";

type LoaderData = {
  department: Department & { organisation: Organisation };
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData | Response> => {
  const department = await getDepartment({
    departmentId: String(params.departmentId),
  });

  if (!department) return redirect("/organisations");

  return { department };
};

export default function DepartmentLayout() {
  const { department } = useLoaderData<LoaderData>();
  const { departmentId } = useParams();

  return (
    <div className="w-full flex flex-col">
      <Navigator
        organisation={department.organisation}
        // organisationTo={`/organisations/${department.organisation.id}/departments`}
        department={department}
      />
      <Tabs>
        <Tabs.Tab to={`/departments/${departmentId}/employees`}>
          Medewerkers
        </Tabs.Tab>
        <Tabs.Tab to={`/departments/${departmentId}/plannings`}>
          Roosters
        </Tabs.Tab>
      </Tabs>
      <Outlet />
    </div>
  );
}
