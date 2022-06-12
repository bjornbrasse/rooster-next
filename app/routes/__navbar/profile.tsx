import * as React from 'react';
import {
  ActionFunction,
  ErrorBoundaryComponent,
  LoaderFunction,
  redirect,
  useLoaderData,
} from 'remix';
import { db } from '~/utils/db.server';
import {
  requireUser,
  requireUserId,
  UserSecure,
} from '~/controllers/auth.server';
import { useDropzone } from 'react-dropzone';
import { classNames } from '~/utils/helpers';
// const cloudinary = require('cloudinary').v2;
import { v2 as cloudinary } from 'cloudinary';
import { getCloudinarySignature } from '~/utils/cloudinary.server';

type LoaderData = {
  user: UserSecure;
};

const colors: string[] = ['#c43434', '#cac060'];

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request, { redirectTo: '/login' });

  if (!user) return redirect('/home');

  return { user };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const form = await request.formData();
  const firstName = form.get('firstName');
  const lastName = form.get('lastName');
  if (typeof firstName !== 'string' || typeof lastName !== 'string') {
    throw new Error(`Form not submitted correctly.`);
  }

  await db.user.update({
    where: { id: userId },
    data: { firstName, lastName },
  });
};

export default function ProfileRoute() {
  const data = useLoaderData<LoaderData>();

  const onDrop = React.useCallback((acceptedFiles) => {
    const [signature, timestamp] = getCloudinarySignature();
    console.log('HIER', signature, timestamp);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  return (
    <div>
      <h1>Profiel Pagina</h1>
      <p>Gebruiker: {data.user?.email}</p>
      <form method="POST">
        <label htmlFor="firstName">
          Voornaam
          <p>
            <input
              type="text"
              name="firstName"
              id="firstName"
              defaultValue={data.user?.firstName}
            />
          </p>
        </label>
        <label htmlFor="lastName">
          Achternaam
          <p>
            <input
              type="text"
              name="lastName"
              id="lastName"
              defaultValue={data.user?.lastName}
            />
          </p>
        </label>
        {colors.map((color, idx) => (
          <div
            className="h-10 w-10"
            style={{ backgroundColor: color }}
            key={idx}
          >
            BB
          </div>
        ))}
        <button type="submit">Opslaan</button>
      </form>
      <div
        {...getRootProps()}
        className={classNames(
          'flex h-48 w-96 items-center justify-center border border-red-600 bg-red-100 text-xl',
          isDragActive ? 'bg-blue-400' : null,
        )}
      >
        <p>Drop file here.</p>
        <input {...getRootProps()} type="hidden" />
      </div>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <div>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  );
};
