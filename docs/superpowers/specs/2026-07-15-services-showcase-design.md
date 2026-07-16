# Services Showcase — Design Spec

Date: 2026-07-15
Status: Approved

## Background

The real site (`ktdoctor.com/services`) lists 21 real pediatric services,
presented as a flat list with a "SEE DETAILS" link per service (which likely
leads to individual detail pages on the real site, not being rebuilt here).
The boss's manus.space mockup does not have a genuine services page — its
"Services" nav item and dropdown only surface booking-widget visit types
(Well-Child Checkup, Sick Visit, etc.), not a documented content page. So
`ktdoctor.com/services` is the sole real source for this feature.

This follows the same pattern as the Network and Foundation showcases: real
content only, grouped for scannability, no fabricated statistics or
services beyond what the real site lists.

## Goals

- Give the KTMG site a `/services` page listing all 21 real services from
  `ktdoctor.com/services`, grouped into 5 categories for readability (the
  real site itself has no category grouping — this is our own curation).
- Add a homepage teaser card (joining the existing Careers/Insurance/
  Resources teaser row, making it 4 cards).
- Add "Services" to the Header's "More" dropdown.

## Real reference data (captured 2026-07-15, from ktdoctor.com/services)

Grouped into 5 categories, all 21 real services accounted for:

**Preventive & Wellness Care**
- Well Child Exam — preventive wellness checkups
- Physicals — routine health examinations
- Free Vaccines — complimentary immunization services
- COVID-19 Vaccine — vaccination services for coronavirus protection
- Nutrition — dietary guidance and nutritional support

**Newborn & Family Care**
- Newborn Care — care specifically for infants
- Expectant Parents — prenatal guidance and preparation for new parents
- Circumcisions — surgical procedure for newborns and children

**Sick & Urgent Care**
- Sick Visits — treatment for acute illnesses
- Same-Day Appointments — urgent care made easy with same-day scheduling
- Walk-Ins — unscheduled patient visits accepted
- Telehealth — remote medical consultations
- Pediatric Infectious Disease — treatment of infections in children
- Sports Injuries — specialized sports injury care

**Behavioral & Developmental Health**
- ADHD & Behavioral Issues — comprehensive care for ADHD and behavioral
  concerns
- Autism & Developmental Disorders / Special Needs — specialized support
  for children with autism and developmental conditions
- Childhood Obesity & Weight Management — programs supporting healthy
  weight and lifestyle habits

**Specialty & Adolescent Care**
- Asthma & Allergy Center — specialized care for respiratory symptoms and
  allergies
- Allergies — treatment for childhood allergic conditions
- Adolescent Medicine — healthcare tailored for teenagers
- Teenage Gynecology & Menstrual Disorders — adolescent reproductive
  health services

Hero copy (paraphrased from the real page's own intro, not copied
verbatim): heading "Comprehensive Pediatric Care", intro along the lines of
"Kids & Teens Medical Group provides exceptional healthcare tailored to the
needs of children and adolescents, from newborn checkups to teen medicine."

## Data model

`data/services.ts`:

```ts
export type Service = {
  id: string;
  name: string;
  description: string;
};

export type ServiceCategory = {
  id: string;
  name: string;
  services: Service[];
};

export const serviceCategories: ServiceCategory[];
```

## Pages

- `/services` — plain Server Component (no client state needed, matching
  the Foundation page pattern), with `metadata` export, hero section, and
  one grid section per category using a `ServiceCard` component
  (name + description, no icon system beyond what already exists in the
  design system).
- Homepage teaser — a 4th card added to the existing Careers/Insurance/
  Resources teaser row, linking to `/services`.
- Header "More" dropdown — add a "Services" link alongside Network,
  Foundation, Insurance, Resources.

## Addendum (2026-07-16): Service detail pages

**This section supersedes the "no individual per-service detail pages"
line under Explicitly Out of Scope below** — the client asked for each
service card to link through to a real detail page, sourced from the
real content on each of the 21 corresponding pages under
`ktdoctor.com/services/`.

**Approach:** each of the 21 real services has its own detail page on the
real site (e.g. `ktdoctor.com/services/asthma-and-allergy-center/`).
Content depth on the real pages varies widely (some include detailed
clinical protocols, specific test names, and external medical links).
To keep this site's coverage consistent, accurate, and low-risk, every
detail page here gets the same shape: a real, paraphrased 2-3 sentence
description (not a verbatim copy) drawn from that service's real page,
plus a Book Appointment CTA. Exact clinical protocol specifics (dosing,
named clinical tests, external medical PDFs) are intentionally not
reproduced, since KTMG's own clinical team should be the source of truth
for that level of detail, not a paraphrased AI summary.

**Data model change:** add one field to `Service`:

```ts
export type Service = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
};
```

**Real long descriptions (paraphrased 2026-07-16 from ktdoctor.com/services/*):**

- **well-child-exam**: Well child exams are routine visits from infancy through the teen years that track your child's growth, development, and overall health. Each visit covers physical growth, developmental milestones, vaccinations, nutrition, and behavioral health, with guidance tailored to your child's age. These regular checkups help our pediatricians catch potential concerns early, before they become bigger problems.
- **physicals**: Following American Academy of Pediatrics guidelines, we recommend regular physical exams from infancy through age 21 to track immunizations, growth, and development. These visits give you a chance to discuss any health concerns while your pediatrician confirms your child is on a healthy path. Physicals can be scheduled online or by phone, whether for a routine checkup or a specific concern like a sports or school physical.
- **free-vaccines**: Through the state's Child Health and Disability Prevention program, we provide free vaccinations for eligible children and teens. Our board-certified pediatricians administer all CDC-recommended vaccines to help protect your child and the community from preventable diseases. Ask your pediatrician about the recommended immunization schedule at your next visit.
- **covid-19-vaccine**: We offer COVID-19 vaccinations, including initial doses and boosters, for patients across our clinics. Vaccines undergo rigorous testing and have proven highly effective at preventing severe illness and hospitalization. Getting vaccinated helps protect your family and contributes to community immunity for those most vulnerable.
- **nutrition**: Proper nutrition is the foundation of a healthy childhood, and our pediatric team offers dietary assessments and personalized nutrition guidance at every stage. From feeding guidance for infants to healthy eating education for school-age children and teens, we tailor our approach to your child's developmental needs. We also support families working on weight management with practical, judgment-free guidance.
- **newborn-care**: Our board-certified pediatricians provide comprehensive care for newborns, from monitoring growth and development to guiding feeding and nutrition. Visits include age-appropriate vaccinations, developmental milestone tracking, and guidance on sleep, diapering, and other early parenting questions. We also offer free meet-and-greet consultations so you can get to know your pediatrician before your baby arrives.
- **expectant-parents**: We offer free meet-and-greet consultations for expectant parents, giving you the chance to meet and choose a pediatrician before your baby is born. Once your baby arrives, we coordinate care at partner hospitals and schedule a follow-up visit within 24 to 48 hours of discharge. Our team can also help guide you through insurance enrollment and what to expect at your baby's first pediatric visits.
- **circumcisions**: We offer circumcision procedures for newborns and children performed by qualified physicians, with anesthesia used to minimize discomfort. Circumcision is a personal decision for every family, and our team is happy to discuss the potential benefits and considerations so you can make the choice that's right for your child. Clear post-procedure care instructions are provided to support healing.
- **sick-visits**: When your child isn't feeling well, our same-day sick visits give you fast access to a pediatrician who can diagnose and treat acute illnesses and minor injuries. Appointments can be scheduled online or by phone, and telehealth options are available for added convenience. Beyond sick visits, our locations also offer vaccinations, sports injury care, and other pediatric services your family may need.
- **same-day-appointments**: We know that when your child is sick or hurt, timely care matters, which is why we offer same-day appointments at our clinics across Greater LA. You can schedule by phone, online, or through after-hours telehealth, so care is available when you need it most. Same-day scheduling means less time worrying and more time getting your child the attention they need.
- **walk-ins**: Walk-in visits are welcome at our clinics for common illnesses, minor injuries, infections, allergies, and other unexpected health concerns. Our pediatricians provide prompt, experienced care without requiring an appointment ahead of time. It's a convenient option for families who need pediatric care right away.
- **telehealth**: Our telehealth visits let you connect with a board-certified pediatrician remotely through a secure virtual platform, without needing to leave home. Pediatricians can evaluate concerns, offer medical advice, and provide treatment recommendations with the same care and attention as an in-person visit. It's a flexible option for busy families or when getting to a clinic isn't easy.
- **pediatric-infectious-disease**: Our pediatricians diagnose and treat a range of infectious diseases in children and teens, working closely with families to build a treatment plan suited to their child's needs. Care spans prevention, diagnosis, and treatment, paired with clear education so families understand their child's condition. Compassionate, collaborative care is at the center of how we approach every case.
- **sports-injuries**: Active kids sometimes get hurt, and our board-certified pediatricians offer prompt evaluation and treatment for pediatric sports injuries. With urgent care available seven days a week, in person, online, or via after-hours telehealth, your young athlete can get back in the game safely. Multiple locations across Greater LA make it easy to find care close to home.
- **adhd-behavioral-issues**: We provide comprehensive evaluation, diagnosis, and ongoing management of ADHD and related behavioral concerns in children and teens. Our pediatricians monitor patients regularly, adjusting care as needed, and refer more complex cases to behavioral therapy or psychiatric specialists. Both in-person and telehealth visits are available across our Southern California locations.
- **autism-developmental-disorders**: Our pediatricians offer specialized evaluation and ongoing management for children with autism and other developmental or behavioral disorders. We coordinate with specialists and schools, reviewing educational documents to help guide families toward the right interventions and support services. Monitoring is tailored to each child's needs, from more frequent visits to periodic check-ins.
- **childhood-obesity-weight-management**: Developed in partnership with Children's Hospital Los Angeles, our weight management program supports children and families addressing childhood obesity. The program includes monthly monitoring visits (in-person or via telehealth), periodic lab work based on individual risk factors, and weekly educational classes. It's a comprehensive, judgment-free approach to building healthier habits as a family.
- **asthma-allergy-center**: Our Asthma & Allergy Center offers ongoing monitoring and personalized care for children living with asthma or allergies. Depending on your child's needs, we may recommend regular check-ins, medication review, a customized asthma action plan, and asthma education to help manage symptoms day to day. If your child is wheezing, coughing, or has chest tightness, our team can help identify triggers and build a treatment plan that works for your family.
- **allergies**: Childhood allergies can show up in many ways, from persistent cold-like symptoms to skin reactions and digestive issues. Our board-certified pediatricians offer testing, allergen avoidance guidance, medication management, and immunotherapy options tailored to your child's needs. With multiple locations across Greater LA, expert allergy care is never far away.
- **adolescent-medicine**: Adolescence brings its own physical, emotional, and social changes, and our adolescent medicine services are designed specifically for teens and young adults. Care includes physical exams, behavioral health support, preventive care and vaccinations, nutrition guidance, and reproductive health education. Our providers are trained to address the unique needs of this age group across multiple Greater LA locations.
- **teenage-gynecology-menstrual-disorders**: We offer gynecological care designed specifically for teenagers, including education about puberty and menstruation, routine exams, and treatment for menstrual irregularities. Early, informed care can help young women make confident, educated choices about their health. Appointments are available online, by phone, or via telehealth, in a setting designed to be comfortable and confidential.

**Routing:** new dynamic route `app/[locale]/services/[slug]/page.tsx`
(plain Server Component, `generateStaticParams()` off all 21 service ids,
`generateMetadata()` per service using its real name). `ServiceCard`
becomes a link to `/services/{id}`. Each detail page shows: a back link
to `/services`, an eyebrow (the service's category name), heading
(service name), tagline (existing short `description`), the new
`longDescription`, and a "Book an Appointment" CTA (external, same
`BOOKING_URL` used site-wide).

## Explicitly out of scope

- ~~No individual per-service detail pages~~ — superseded by the Addendum
  above; detail pages are now in scope.
- No EN/ES translation of this content now — it joins the same future
  translation pass as Network/Foundation/Careers/Insurance/Resources
  (tracked as "Plan B" from the EN/ES toggle spec).
- No new icons/illustrations beyond the existing design system's simple
  card treatment.
- No reproduction of exact clinical protocols, named medical tests, or
  external medical resource links from the real pages — see Addendum.

## Next steps

1. Write an implementation plan (writing-plans skill) covering the new
   `longDescription` field and the `/services/[slug]` detail route.
2. Execute.
