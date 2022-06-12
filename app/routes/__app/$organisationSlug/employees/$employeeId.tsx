import { ActionFunction, Form, json, redirect, useLoaderData } from 'remix';
import { BBLoader } from 'types';
import { setPasswordResetToken } from '~/controllers/auth.server';
import { getUser } from '~/controllers/user.server';
import { sendEmail } from '~/utils/email';
import { passwordResetEmail } from '~/utils/email/templates';
import { badRequest } from '~/utils/helpers';

type LoaderData = {
  employee: Exclude<Awaited<ReturnType<typeof getUser>>, null>;
};

export const loader: BBLoader<{
  employeeId: string;
  organisationId: string;
}> = async ({ params }) => {
  const employee = await getUser({ id: params.employeeId });

  if (!employee) return redirect(`/organisations/${params.organisationId}`);

  return json({ employee });
};

export const action: ActionFunction = async ({ request, params }) => {
  const action = (await request.formData()).get('_action');

  if (action === 'resetPassword') {
    const { userId } = params;
    console.log('SENDING MESSAGE 1');

    const response = await setPasswordResetToken({ userId: userId ?? '' });

    if (response.success) {
      const { user } = response;

      try {
        await sendEmail(
          [user.email],
          passwordResetEmail(
            user.firstName,
            `/auth/passwordReset?token=${user.passwordResetToken}`,
          ),
          'pwrt',
        );
      } catch (error) {
        return console.log('Er is iets fout gegaan', error);
      }
    }
    console.log('SENDING MESSAGE 2');

    return json({ isSent: true });
  }

  return badRequest({ success: false });
};

export default function OrganisationEmployee() {
  const {
    employee: { firstName, lastName },
  } = useLoaderData() as LoaderData;

  return (
    <div>
      <p>Medewerker</p>
      <p>{firstName}</p>
      <p>{lastName}</p>
      <Form method="post">
        <button className="btn btn-save" name="_action" value="resetPassword">
          Reset Wachtwoord
        </button>
      </Form>
    </div>
  );
}
