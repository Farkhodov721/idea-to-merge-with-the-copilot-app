import { describe, expect, test } from "vitest";
import {
  formatBookmark,
  nextSlug,
  normalizeUrl,
  parseBookmarks,
} from "../src/lib/bookmarks";

describe("normalizeUrl", () => {
  test("adds https:// when missing", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com");
  });

  test("leaves an existing https:// URL unchanged", () => {
    expect(normalizeUrl("https://example.com")).toBe("https://example.com");
  });

  test("a URL with and without https:// normalises to the same value", () => {
    expect(normalizeUrl("example.com")).toBe(
      normalizeUrl("https://example.com")
    );
  });

  test("leaves an existing http:// URL unchanged", () => {
    expect(normalizeUrl("http://example.com")).toBe("http://example.com");
  });
});

describe("nextSlug", () => {
  test("generates a mona- prefixed base62 slug", () => {
    expect(nextSlug(0)).toBe("mona-0");
    expect(nextSlug(61)).toBe("mona-z");
  });
});

describe("formatBookmark", () => {
  test("formats with the exact :: separator", () => {
    expect(formatBookmark({ url: "https://example.com", slug: "mona-7fk2" })).toBe(
      "https://example.com :: mona-7fk2"
    );
  });
});

describe("parseBookmarks", () => {
  test("recovers from an empty value", () => {
    expect(parseBookmarks(null)).toEqual([]);
    expect(parseBookmarks("")).toEqual([]);
  });

  test("recovers from corrupted JSON", () => {
    expect(parseBookmarks("{not valid json")).toEqual([]);
  });

  test("recovers from a legacy / non-array value", () => {
    expect(parseBookmarks('{"url":"https://example.com"}')).toEqual([]);
  });

  test("drops malformed entries and keeps valid ones", () => {
    const raw = JSON.stringify([
      { url: "https://example.com", slug: "mona-1" },
      { url: "https://missing-slug.com" },
      "not-an-object",
      { url: "https://example.org", slug: "mona-2" },
    ]);
    expect(parseBookmarks(raw)).toEqual([
      { url: "https://example.com", slug: "mona-1" },
      { url: "https://example.org", slug: "mona-2" },
    ]);
  });

  test("parses a well-formed array", () => {
    const raw = JSON.stringify([
      { url: "https://example.com", slug: "mona-7fk2" },
    ]);
    expect(parseBookmarks(raw)).toEqual([
      { url: "https://example.com", slug: "mona-7fk2" },
    ]);
  });
});
