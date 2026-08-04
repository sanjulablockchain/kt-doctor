const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Prefixes a root-relative public asset path (e.g. "/foo.png") with the app's
 * basePath. next/link and next/image internals prefix automatically; raw
 * strings passed to `src`/`href` do not, so anything reading from `public/`
 * directly needs this.
 */
export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
