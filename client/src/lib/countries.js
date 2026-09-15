/**
 * Country options for the registration forms.
 *
 * The list is stored as ISO 3166-1 alpha-2 codes and the display names come
 * from `Intl.DisplayNames`, so the dropdown is correctly localised in both
 * Arabic and English without shipping (and maintaining) two hand-written name
 * lists. The stored value is the human-readable name, because that is what the
 * existing registration records hold and what the admin screens display.
 */
const CODES = [
  'DZ', 'MA', 'TN', 'LY', 'MR', 'EG', 'SD', 'SA', 'AE', 'QA', 'KW', 'BH', 'OM',
  'YE', 'JO', 'PS', 'LB', 'SY', 'IQ', 'TR', 'SO', 'DJ', 'KM',
  'SN', 'ML', 'NE', 'NG', 'TD', 'CM', 'CI', 'GH', 'BF', 'GN', 'BJ', 'TG', 'GA',
  'CD', 'CG', 'KE', 'TZ', 'UG', 'ET', 'ZA', 'RW', 'BI', 'MG', 'MZ', 'AO',
  'FR', 'ES', 'IT', 'DE', 'BE', 'NL', 'CH', 'AT', 'PT', 'GB', 'IE', 'SE', 'NO',
  'DK', 'FI', 'PL', 'CZ', 'RO', 'GR', 'RU', 'UA',
  'US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE',
  'CN', 'JP', 'KR', 'IN', 'PK', 'BD', 'ID', 'MY', 'SG', 'TH', 'VN', 'PH',
  'AF', 'IR', 'AZ', 'KZ', 'UZ',
  'AU', 'NZ',
];

/** Localised, alphabetically sorted country names for `locale` ('ar' | 'en'). */
export function countryNames(locale = 'ar') {
  let display = null;
  try {
    display = new Intl.DisplayNames([locale], { type: 'region' });
  } catch {
    display = null;
  }
  const names = CODES.map((code) => {
    try {
      return display?.of(code) || code;
    } catch {
      return code;
    }
  });
  try {
    return names.sort(new Intl.Collator(locale).compare);
  } catch {
    return names.sort();
  }
}

export default CODES;
