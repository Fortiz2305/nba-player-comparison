export const locales = ['en', 'es'] as const;
export type Locale = typeof locales[number];

export async function getMessages(locale: Locale) {
  try {
    return (await import(`./messages/${locale}/index.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    return {};
  }
}

export function getLocaleFromCountry(country: string): Locale {
  const spanishSpeakingCountries = [
    'ES', // Spain
    'MX', // Mexico
    'CO', // Colombia
    'AR', // Argentina
    'PE', // Peru
    'VE', // Venezuela
    'CL', // Chile
    'EC', // Ecuador
    'GT', // Guatemala
    'CU', // Cuba
    'BO', // Bolivia
    'DO', // Dominican Republic
    'HN', // Honduras
    'PY', // Paraguay
    'SV', // El Salvador
    'NI', // Nicaragua
    'CR', // Costa Rica
    'PA', // Panama
    'UY', // Uruguay
    'PR', // Puerto Rico
    'GQ'  // Equatorial Guinea
  ];

  return spanishSpeakingCountries.includes(country) ? 'es' : 'en';
}
