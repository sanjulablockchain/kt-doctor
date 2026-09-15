import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Guards the search-result favicon.
 *
 * These assets previously regressed twice over: `app/favicon.ico` was still the
 * stock Next.js placeholder, and the layout's metadata overrode it with
 * `/clinic-logo.svg`, a 400x123.5 horizontal lockup. Google renders favicons in
 * a square box, so the wide lockup letterboxed down to an illegible smudge in
 * search results. Both failure modes are cheap to assert, so we assert them.
 */

const APP_DIR = join(process.cwd(), "app");

/** Reads width/height out of a PNG's IHDR chunk. */
function pngSize(file: string) {
  const buf = readFileSync(join(APP_DIR, file));
  expect(buf.subarray(0, 4).toString("hex")).toBe("89504e47");
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/** Reads the directory entries out of an .ico. */
function icoEntries(file: string) {
  const buf = readFileSync(join(APP_DIR, file));
  expect(buf.readUInt16LE(0)).toBe(0); // reserved
  expect(buf.readUInt16LE(2)).toBe(1); // type: icon
  const count = buf.readUInt16LE(4);
  return Array.from({ length: count }, (_, i) => {
    const o = 6 + i * 16;
    return { width: buf[o] || 256, height: buf[o + 1] || 256 };
  });
}

describe("app icons", () => {
  it("ships a favicon.ico covering the 16/32/48 sizes browsers ask for", () => {
    const sizes = icoEntries("favicon.ico");
    expect(sizes.map((s) => s.width).sort((a, b) => a - b)).toEqual([16, 32, 48]);
  });

  it("keeps every favicon.ico entry square", () => {
    for (const { width, height } of icoEntries("favicon.ico")) {
      expect(width).toBe(height);
    }
  });

  it("ships a square icon.png whose sides are a multiple of 48", () => {
    // Google's favicon guidance: square, with sides a multiple of 48px.
    const { width, height } = pngSize("icon.png");
    expect(width).toBe(height);
    expect(width % 48).toBe(0);
  });

  it("ships a square apple-icon.png", () => {
    const { width, height } = pngSize("apple-icon.png");
    expect(width).toBe(height);
    expect(width).toBeGreaterThanOrEqual(180);
  });

  it("does not override the file-convention icons with the wide logo lockup", () => {
    const layout = readFileSync(join(APP_DIR, "[locale]", "layout.tsx"), "utf8");
    expect(layout).not.toMatch(/icons\s*:/);
    expect(layout).not.toMatch(/clinic-logo\.svg/);
  });
});
