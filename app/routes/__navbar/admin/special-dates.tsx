// import { useFetcher } from 'remix';
import dayjs from 'dayjs';
import { LoaderFunction, useLoaderData, json } from 'remix';
import { Container } from '~/components/container';
import {
  SpecialDateForm,
  links as specialDateFormLinks,
} from '~/components/forms/special-date-form';
import { useDialog } from '~/contexts/dialog';
import { MONTHS, WEEKDAYS } from '~/utils/date';
import { db } from '~/utils/db.server';

export const links = () => [...specialDateFormLinks()];

async function getSpecialDates() {
  return await db.specialDate.findMany({});
}

type LoaderData = {
  specialDates: Awaited<ReturnType<typeof getSpecialDates>>;
};

export const loader: LoaderFunction = async () => {
  const specialDates = await getSpecialDates();

  return json<LoaderData>({ specialDates });
};

export default function SpecialDates() {
  const { specialDates } = useLoaderData() as LoaderData;
  // const fetcher = useFetcher();
  const { closeDialog, openDialog } = useDialog();

  return (
    <Container>
      <div className="flex justify-between">
        <h1>Speciale dagen</h1>
        <button
          className="h-10 w-10 rounded-full text-lg hover:bg-gray-500 hover:text-white"
          onClick={() =>
            openDialog(
              'Nieuwe datum aanmaken',
              <SpecialDateForm onSaved={() => closeDialog()} />,
            )
          }
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th className="w-48 border border-white p-1 text-left">Datum</th>
            <th>Naam</th>
          </tr>
        </thead>
        <tbody>
          {specialDates.map((specialDate) => (
            <tr
              className="cursor-pointer hover:bg-lime-400"
              key={specialDate.id}
              onClick={() =>
                openDialog(
                  'Bewerken',
                  <SpecialDateForm
                    onSaved={() => closeDialog()}
                    specialDate={specialDate}
                  />,
                )
              }
            >
              <td>{`${WEEKDAYS[dayjs(specialDate.date).day()].name.nl} ${dayjs(
                specialDate.date,
              ).date()} ${MONTHS[dayjs(specialDate.date).month()].name} ${dayjs(
                specialDate.date,
              ).year()}`}</td>
              <td>{specialDate.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}
