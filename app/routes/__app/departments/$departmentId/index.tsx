import { Department } from "@prisma/client";
import { LoaderFunction, redirect } from "remix";
import { useMatches, useParams } from "remix";
import Container from "~/components/Container";
import { getDepartment } from "~/controllers/department";

type LoaderData = {
  department: Department;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData | Response> => {
  const department = await getDepartment({
    departmentId: String(params.departmentId),
  });

  if (!department) return redirect("/");

  return { department };
};

export default function Department() {
  const { departmentId } = useParams();
  // const parentData = useMatches().find(
  //   (m) => m.pathname === `/${organisationSlug}/admin/departments`
  // )?.data as {
  //   departments: Array<Department>;
  // };

  return (
    <Container>
      <h3>INstellingen </h3>
    </Container>
  );
}
