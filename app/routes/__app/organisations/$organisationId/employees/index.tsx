import { User } from '@prisma/client';
import * as React from 'react';
import { LoaderFunction, useLoaderData } from 'remix';
import { Container } from '~/components/container';
import { getOrganisationEmployees, getUsers } from '~/controllers/user.server';

export default function OrganisationEmployees() {
  // const { employees } = useLoaderData<LoaderData>();

  return (
    <Container>
      <span>Hoi</span>
    </Container>
  );
}
