/**
 * Centralized site constants. Pull the public base URL from here rather
 * than repeating `process.env.NEXT_PUBLIC_SITE_URL || 'https://…'` in
 * every metadata file.
 */

export const SITE_NAME = 'Priče za laku noć'
export const SITE_LANG = 'hr'
export const SITE_DEFAULT_DESCRIPTION =
  'Besplatne priče za djecu za laku noć. Čitajte najljepše bajke, basne i priče za djecu prije spavanja – na hrvatskom jeziku.'

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://pricezalakunoc.hr'
}
