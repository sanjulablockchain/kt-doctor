import { describe, it, expect } from "vitest";
import { parentResources } from "./resources";

describe("parent resources data", () => {
  it("has the 5 real resource categories", () => {
    expect(parentResources.map((r) => r.id).sort()).toEqual(
      [
        "our-doctors",
        "vaccine-schedule",
        "patient-forms",
        "developmental-milestones",
        "must-watch-videos",
      ].sort()
    );
  });

  it("marks the real, currently-available resources as available with a real href", () => {
    const byId = Object.fromEntries(parentResources.map((r) => [r.id, r]));

    expect(byId["our-doctors"].available).toBe(true);
    expect(byId["our-doctors"].href).toBe("/doctors");
    expect(byId["our-doctors"].external).toBeFalsy();

    expect(byId["vaccine-schedule"].available).toBe(true);
    expect(byId["vaccine-schedule"].href).toBe("/vaccine-schedule.jpg");

    expect(byId["patient-forms"].available).toBe(true);
    expect(byId["patient-forms"].href).toBe("https://healow.com/apps/jsp/webview/signIn.jsp");
    expect(byId["patient-forms"].external).toBe(true);

    expect(byId["must-watch-videos"].available).toBe(true);
    expect(byId["must-watch-videos"].href).toBe(
      "https://www.youtube.com/channel/UC5pMXGZ_F2OZUFdfy6YbIew"
    );
    expect(byId["must-watch-videos"].external).toBe(true);
  });

  it("leaves developmental milestones as not yet available", () => {
    const developmental = parentResources.find((r) => r.id === "developmental-milestones");
    expect(developmental?.available).toBe(false);
  });
});
