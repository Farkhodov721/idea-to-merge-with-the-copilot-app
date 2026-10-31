// Pure helpers for the bookmarks feature. No browser APIs here so these
// can be unit tested without a DOM, and reused by the client-side script
// in src/components/Bookmarks.astro.

export const STORAGE_KEY = "mona-bookmarks";

export interface Bookmark {
  url: string;
  slug: string;
}

const BASE62_CHARS =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function toBase62(value: number): string {
  if (value === 0) return "0";
  let result = "";
  let n = value;
  while (n > 0) {
    result = BASE62_CHARS[n % 62] + result;
    n = Math.floor(n / 62);
  }
  return result;
}

/**
 * Normalises user-entered URLs so "example.com" and "https://example.com"
 * (and "http://example.com") all save to the same value.
 */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Generates a short "mona-" prefixed base62 slug. Pass a counter (or any
 * monotonically increasing / random integer) to keep slugs unique.
 */
export function nextSlug(seed: number): string {
  return `mona-${toBase62(seed)}`;
}

/**
 * Formats a bookmark for display with the exact " :: " separator required
 * between the URL and its slug.
 */
export function formatBookmark(bookmark: Bookmark): string {
  return `${bookmark.url} :: ${bookmark.slug}`;
}

function isBookmark(value: unknown): value is Bookmark {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).url === "string" &&
    typeof (value as Record<string, unknown>).slug === "string"
  );
}

/**
 * Parses and validates a raw localStorage string. Never throws: empty,
 * corrupted, legacy, or non-array values all recover to an empty list
 * instead of crashing the app.
 */
export function parseBookmarks(raw: string | null): Bookmark[] {
  if (!raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isBookmark);
}

export function serializeBookmarks(bookmarks: Bookmark[]): string {
  return JSON.stringify(bookmarks);
}
