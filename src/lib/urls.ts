import { API_URL } from './config';

/**
 * The API returns some files as paths on the web app (`/images/events/…`,
 * local uploads). The app needs full addresses.
 */
export function absoluteUrl(url: string, base: string = API_URL): string {
  return url.startsWith('/') ? `${base}${url}` : url;
}
