import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactElement } from "react";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const NAVY = "#1e2940";
const TEAL = "#0e8fa0";
const GOLD = "#d6a34a";
const IVORY = "#f8fafc";

export async function loadOgFonts() {
  const [regular, extraBold] = await Promise.all([
    readFile(join(process.cwd(), "app/_og/fonts/PlusJakartaSans-Regular.ttf")),
    readFile(join(process.cwd(), "app/_og/fonts/PlusJakartaSans-ExtraBold.ttf")),
  ]);
  return [
    { name: "Jakarta", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Jakarta", data: extraBold, weight: 800 as const, style: "normal" as const },
  ];
}

export function OgCard({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: string;
}): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: NAVY,
        padding: 80,
        fontFamily: "Jakarta",
      }}
    >
      <div
        style={{
          display: "flex",
          height: 12,
          width: 160,
          background: TEAL,
          borderRadius: 999,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {eyebrow ? (
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 400,
              color: GOLD,
              marginBottom: 16,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 800,
            color: IVORY,
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 30, fontWeight: 800, color: IVORY }}>
        Kids &amp; Teens Medical Group
      </div>
    </div>
  );
}
