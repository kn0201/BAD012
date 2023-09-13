import { TimezoneDate } from 'timezone-date.ts';

/**
 *
 * @param text {string} example: "2023-09-11"
 */
export function fromHKDateToISODate(text: string): string {
  let parts = text.split('-');
  let y = +parts[0];
  let m = +parts[1] - 1;
  let d = +parts[2];

  let date = new TimezoneDate();
  date.timezone = 8;
  date.setHours(0, 0, 0, 0);
  date.setFullYear(y, m, d);

  console.log('format', text, '->', date.toISOString());

  return date.toISOString();
}
