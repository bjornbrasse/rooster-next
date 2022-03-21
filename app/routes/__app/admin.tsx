import * as React from 'react';
import { LoaderFunction } from 'remix';
import Container from '~/components/Container';
import { Section } from '~/components/section';
import { requireUser } from '~/controllers/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const user = requireUser(request, { isAdmin: true, redirectTo: '/home' });

  return { user };
};

export default function AdminRoute() {
  return (
    <Container>
      <Section caption="Speciale Dagen"></Section>
    </Container>
  );
}
