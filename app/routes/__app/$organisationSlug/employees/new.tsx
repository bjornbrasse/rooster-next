import React from 'react';
import { ActionFunction, Form, redirect, useActionData } from 'remix';
import { z } from 'zod';
import { Field } from '~/components/form-elements';
import { createOrganisation } from '~/controllers/organisation';
import { createUser } from '~/controllers/user.server';
import { inferSafeParseErrors, User } from '~/types';
import { badRequest } from '~/utils/helpers';

const schema = z.object({
  // organisationSlug: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  initials: z.string().optional(),
  email: z.string().email(),
});

type ActionData = {
  fields: z.input<typeof schema>;
  errors?: inferSafeParseErrors<typeof schema>;
  employee?: User;
};

export const action: ActionFunction = async ({ request, params }) => {
  const { organisationSlug } = params;

  const result = schema.safeParse({
    organisationSlug,
    ...Object.fromEntries(await request.formData()),
  });

  if (!result.success) {
    return badRequest({
      data: { errors: result.error.flatten() },
    });
  }

  const { ...fields } = result.data;

  const employee = await createUser({
    data: { ...fields, organisation: { connect: { slug: organisationSlug } } },
  });

  if (!employee) {
    return badRequest({
      data: { errors: { formError: 'Employee not created' } },
    });
  }

  return redirect(`/${organisationSlug}/employees/${employee.id}`);
};

export default function OrganisationEmployeeNew() {
  const data = useActionData() as ActionData;
  const errors = data?.errors;

  return (
    <div>
      <Form method="post">
        <Field name="email" label="Email" error={errors?.fieldErrors?.email} />
        <Field
          name="firstName"
          label="Voornaam"
          error={data?.errors?.fieldErrors?.firstName}
        />
        <Field
          name="lastName"
          label="Achternaam"
          error={data?.errors?.fieldErrors?.lastName}
        />
        <Field
          name="initials"
          label="Initialen"
          error={data?.errors?.fieldErrors?.initials}
        />
        {/* <button
          type="button"
          onClick={() => setChangingPassword(!changingPassword)}
          className="btn btn-save col-span-2"
        >
          Verander wachtwoord
        </button>
        {changingPassword && (
          <>
            <label htmlFor="password">Wachtwoord</label>
            <input type="text" name="password" id="password" />
            <label htmlFor="passwordConfirm">Bevestig wachtwoord</label>
            <input type="text" name="passwordConfirm" id="passwordConfirm" />
          </>
        )} */}
        {/* </fieldset> */}
        <button type="submit" className="btn btn-save">
          Opslaan
        </button>
      </Form>
    </div>
  );
}
