import { describe, it, expect } from "vitest";
import { existsSync } from "fs";
import { join } from "path";
import { serviceCategories } from "./services";

describe("services data", () => {
  it("has exactly 5 categories", () => {
    expect(serviceCategories).toHaveLength(5);
    expect(serviceCategories.map((c) => c.id).sort()).toEqual(
      [
        "preventive-wellness",
        "newborn-family",
        "sick-urgent",
        "behavioral-developmental",
        "specialty-adolescent",
      ].sort()
    );
  });

  it("has exactly 21 real services across all categories, with no duplicate ids", () => {
    const allServices = serviceCategories.flatMap((c) => c.services);
    expect(allServices).toHaveLength(21);
    const ids = allServices.map((s) => s.id);
    expect(new Set(ids).size).toBe(21);
  });

  it("includes every real service name from ktdoctor.com/services", () => {
    const names = serviceCategories.flatMap((c) => c.services.map((s) => s.name));
    expect(names).toEqual(
      expect.arrayContaining([
        "Well Child Exam",
        "Physicals",
        "Free Vaccines",
        "COVID-19 Vaccine",
        "Nutrition",
        "Newborn Care",
        "Expectant Parents",
        "Circumcisions",
        "Sick Visits",
        "Same-Day Appointments",
        "Walk-Ins",
        "Telehealth",
        "Pediatric Infectious Disease",
        "Sports Injuries",
        "ADHD & Behavioral Issues",
        "Autism & Developmental Disorders",
        "Childhood Obesity & Weight Management",
        "Asthma & Allergy Center",
        "Allergies",
        "Adolescent Medicine",
        "Teenage Gynecology & Menstrual Disorders",
      ])
    );
  });

  it("no service name or description contains an em dash", () => {
    const allText = serviceCategories
      .flatMap((c) => [c.name, ...c.services.flatMap((s) => [s.name, s.description])])
      .join(" ");
    expect(allText).not.toContain("—");
  });

  it("every service has a non-empty longDescription with no em dash", () => {
    const allServices = serviceCategories.flatMap((c) => c.services);
    for (const service of allServices) {
      expect(service.longDescription.length).toBeGreaterThan(20);
      expect(service.longDescription).not.toContain("—");
    }
  });

  it("every category and service has real Spanish translations with no em dash", () => {
    for (const category of serviceCategories) {
      expect(category.nameEs.length).toBeGreaterThan(0);
      expect(category.nameEs).not.toContain("—");
      for (const service of category.services) {
        expect(service.nameEs.length).toBeGreaterThan(0);
        expect(service.descriptionEs.length).toBeGreaterThan(20);
        expect(service.longDescriptionEs.length).toBeGreaterThan(20);
        expect(service.nameEs).not.toContain("—");
        expect(service.descriptionEs).not.toContain("—");
        expect(service.longDescriptionEs).not.toContain("—");
      }
    }
  });

  it("enriches the telehealth service with an image, benefits, how-it-works, and schedule", () => {
    const telehealth = serviceCategories
      .flatMap((c) => c.services)
      .find((s) => s.id === "telehealth");
    expect(telehealth).toBeDefined();
    expect(telehealth!.imageSrc).toBe("/services/telehealth.jpg");
    expect(telehealth!.benefits).toHaveLength(5);
    expect(telehealth!.showSchedule).toBe(true);
    expect((telehealth!.howItWorks ?? "").length).toBeGreaterThan(20);
    expect((telehealth!.howItWorksEs ?? "").length).toBeGreaterThan(20);
  });

  it("gives every telehealth benefit bilingual text with no em dash", () => {
    const telehealth = serviceCategories
      .flatMap((c) => c.services)
      .find((s) => s.id === "telehealth")!;
    for (const b of telehealth.benefits ?? []) {
      expect(b.title.length).toBeGreaterThan(0);
      expect(b.titleEs.length).toBeGreaterThan(0);
      expect(b.description.length).toBeGreaterThan(10);
      expect(b.descriptionEs.length).toBeGreaterThan(10);
      for (const s of [b.title, b.titleEs, b.description, b.descriptionEs]) {
        expect(s).not.toContain("—");
      }
    }
    expect(telehealth.howItWorks).not.toContain("—");
    expect(telehealth.howItWorksEs).not.toContain("—");
  });

  it("gives every service an image whose file exists, with bilingual alt and no em dash", () => {
    const allServices = serviceCategories.flatMap((c) => c.services);
    for (const s of allServices) {
      expect(s.imageSrc, `${s.id} missing imageSrc`).toBeTruthy();
      expect(s.imageSrc!.startsWith("/services/")).toBe(true);
      const filePath = join(process.cwd(), "public", s.imageSrc!.replace(/^\//, ""));
      expect(existsSync(filePath), `${s.id} image file missing: ${s.imageSrc}`).toBe(true);
      expect((s.imageAlt ?? "").length, `${s.id} missing imageAlt`).toBeGreaterThan(10);
      expect((s.imageAltEs ?? "").length, `${s.id} missing imageAltEs`).toBeGreaterThan(10);
      expect(s.imageAlt).not.toContain("—");
      expect(s.imageAltEs).not.toContain("—");
    }
  });
});
