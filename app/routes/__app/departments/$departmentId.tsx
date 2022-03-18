import { Department, Organisation, Task, User } from "@prisma/client";
import { LoaderFunction, useLoaderData, useLocation } from "remix";
import { redirect } from "remix";
import { Outlet, useParams } from "remix";
import DialogButton from "~/components/DialogButton";
import ScheduleForm from "~/components/forms/ScheduleForm";
import TaskForm from "~/components/forms/TaskForm";
import UserForm from "~/components/forms/UserForm";
import Navigator from "~/components/Navigator";
import Tabs from "~/components/Tabs";
import { useDialog } from "~/contexts/dialog";
import { getDepartment } from "~/controllers/department";

type LoaderData = {
  department: Awaited<ReturnType<typeof getDepartment>>;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData | Response> => {
  const department = await getDepartment({
    departmentId: String(params.departmentId),
  });

  return { department };
};

export default function DepartmentLayout() {
  const { department } = useLoaderData() as LoaderData;
  const location = useLocation();
  const { departmentId } = useParams();
  const { closeDialog } = useDialog();

  return (
    <div className="w-full flex flex-col">
      <Navigator
        organisation={department.organisation}
        organisationTo={`/organisations/${department.organisation.id}${
          location.pathname.includes("tasks") ? "?redirectTo=tasks" : null
        }`}
        department={department}
        // ook departmentTo maken
      />
      <Tabs
        actions={
          <>
            {location.pathname.endsWith("employees") ? (
              <DialogButton
                description={""}
                form={
                  <UserForm
                    departmentId={departmentId}
                    organisationId={department!.organisation.id}
                    onSaved={function (user: User): void {
                      console.log("gebruiker aangemaakt", user);
                      closeDialog();
                    }}
                  />
                }
                icon="fas fa-plus"
                title="Nieuwe Medewerker"
              />
            ) : location.pathname.endsWith("schedules") ? (
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
            ) : location.pathname.endsWith("/tasks") ? (
              <DialogButton
                description={""}
                form={
                  <TaskForm
                    departmentId={departmentId as string}
                    onSaved={(task: Task): void => {
                      setTimeout(() => closeDialog(), 100);
                    }}
                  />
                }
                icon="fas fa-plus"
                title="Nieuwe Taak"
              />
            ) : null}
          </>
        }
      >
        <Tabs.Tab to={`/departments/${departmentId}/`}>Afdeling</Tabs.Tab>
        <Tabs.Tab to={`/departments/${departmentId}/employees`}>
          Medewerkers
        </Tabs.Tab>
        <Tabs.Tab to={`/departments/${departmentId}/tasks`}>Taken</Tabs.Tab>
        <Tabs.Tab to={`/departments/${departmentId}/schedules`}>
          Roosters
        </Tabs.Tab>
      </Tabs>
      <Outlet />
    </div>
  );
}
