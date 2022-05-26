import { Department, Task } from "@prisma/client";
import * as React from "react";
import { Outlet, useMatches, useParams } from "remix";

export default function DepartmentTaskLayout() {
  const { departmentId, taskId } = useParams();

  const data = useMatches().find(
    (m) => m.pathname === `/departments/${departmentId}/tasks/${taskId}/index`
  )?.data as { tasks: Task[] };

  return (
    <div>
      <div className="border border-red-800">
        {data?.tasks.map((task) => (
          <div className="border-2 border-gray-300" key={task.id}>
            {task.name}
          </div>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
