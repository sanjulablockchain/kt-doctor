import { describe, it, expect } from "vitest";
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
});
