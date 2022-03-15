import { Department, Organisation } from "@prisma/client";
import { LoaderFunction, useLoaderData, useLocation } from "remix";
import { redirect } from "remix";
import { Outlet, useParams } from "remix";
import DialogButton from "~/components/DialogButton";
import ScheduleForm from "~/components/forms/ScheduleForm";
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
  const location = useLocation();
  const { departmentId } = useParams();

  return (
    <div className="w-full flex flex-col">
      <Navigator
        organisation={department.organisation}
        // organisationTo={`/organisations/${department.organisation.id}/departments`}
        department={department}
      />
      <Tabs
        actions={
          <>
            {location.pathname.endsWith("schedules") ? (
              <DialogButton
                description={""}
                form={
                  <ScheduleForm
                    departmentId={departmentId as string}
                    onSaved={function (): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                }
                icon="fas fa-plus"
                title="Rooster toevoegen"
              />
            ) : null}
          </>
        }
      >
        <Tabs.Tab to={`/departments/${departmentId}/employees`}>
          Medewerkers
        </Tabs.Tab>
        <Tabs.Tab to={`/departments/${departmentId}/schedules`}>
          Roosters
        </Tabs.Tab>
      </Tabs>
      <Outlet />
    </div>
  );
}
