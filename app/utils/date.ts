export const MONTHS: { name: string; short: string }[] = [
  { name: 'januari', short: 'jan' },
  { name: 'februari', short: 'feb' },
  { name: 'maart', short: 'mrt' },
  { name: 'april', short: 'apr' },
  { name: 'mei', short: 'mei' },
  { name: 'juni', short: 'jun' },
  { name: 'juli', short: 'jul' },
  { name: 'augustus', short: 'aug' },
  { name: 'september', short: 'sep' },
  { name: 'oktober', short: 'okt' },
  { name: 'november', short: 'nov' },
  { name: 'december', short: 'dec' },
];

export const WEEKDAYS: {
  name: { eng: string; nl: string };
  short: string;
  abbr: { eng: string; nl: string };
}[] = [
  {
    name: { eng: 'sunday', nl: 'zondag' },
    short: 'zo',
    abbr: { eng: '', nl: 'Zo' },
  },
  {
    name: { eng: 'monday', nl: 'maandag' },
    short: 'ma',
    abbr: { eng: '', nl: 'M' },
  },
  {
    name: { eng: 'tuesday', nl: 'dinsdag' },
    short: 'di',
    abbr: { eng: '', nl: 'Di' },
  },
  {
    name: { eng: 'wednesday', nl: 'woensdag' },
    short: 'wo',
    abbr: { eng: '', nl: 'W' },
  },
  {
    name: { eng: 'thursday', nl: 'donderdag' },
    short: 'do',
    abbr: { eng: '', nl: 'Do' },
  },
  {
    name: { eng: 'friday', nl: 'vrijdag' },
    short: 'vr',
    abbr: { eng: '', nl: 'V' },
  },
  {
    name: { eng: 'saturday', nl: 'zaterdag' },
    short: 'za',
    abbr: { eng: '', nl: 'Za' },
  },
];
