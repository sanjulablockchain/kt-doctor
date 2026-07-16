export type Service = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
};

export type ServiceCategory = {
  id: string;
  name: string;
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "preventive-wellness",
    name: "Preventive & Wellness Care",
    services: [
      {
        id: "well-child-exam",
        name: "Well Child Exam",
        description: "Routine preventive wellness checkups tracking growth and development at every age.",
        longDescription: "Well child exams are routine visits from infancy through the teen years that track your child's growth, development, and overall health. Each visit covers physical growth, developmental milestones, vaccinations, nutrition, and behavioral health, with guidance tailored to your child's age. These regular checkups help our pediatricians catch potential concerns early, before they become bigger problems.",
      },
      {
        id: "physicals",
        name: "Physicals",
        description: "Routine health examinations, including sports and school physicals.",
        longDescription: "Following American Academy of Pediatrics guidelines, we recommend regular physical exams from infancy through age 21 to track immunizations, growth, and development. These visits give you a chance to discuss any health concerns while your pediatrician confirms your child is on a healthy path. Physicals can be scheduled online or by phone, whether for a routine checkup or a specific concern like a sports or school physical.",
      },
      {
        id: "free-vaccines",
        name: "Free Vaccines",
        description: "Complimentary childhood immunizations for eligible patients.",
        longDescription: "Through the state's Child Health and Disability Prevention program, we provide free vaccinations for eligible children and teens. Our board-certified pediatricians administer all CDC-recommended vaccines to help protect your child and the community from preventable diseases. Ask your pediatrician about the recommended immunization schedule at your next visit.",
      },
      {
        id: "covid-19-vaccine",
        name: "COVID-19 Vaccine",
        description: "Vaccination services to help protect your child against COVID-19.",
        longDescription: "We offer COVID-19 vaccinations, including initial doses and boosters, for patients across our clinics. Vaccines undergo rigorous testing and have proven highly effective at preventing severe illness and hospitalization. Getting vaccinated helps protect your family and contributes to community immunity for those most vulnerable.",
      },
      {
        id: "nutrition",
        name: "Nutrition",
        description: "Dietary guidance and nutritional support for growing children.",
        longDescription: "Proper nutrition is the foundation of a healthy childhood, and our pediatric team offers dietary assessments and personalized nutrition guidance at every stage. From feeding guidance for infants to healthy eating education for school-age children and teens, we tailor our approach to your child's developmental needs. We also support families working on weight management with practical, judgment-free guidance.",
      },
    ],
  },
  {
    id: "newborn-family",
    name: "Newborn & Family Care",
    services: [
      {
        id: "newborn-care",
        name: "Newborn Care",
        description: "Dedicated care for infants from their very first days.",
        longDescription: "Our board-certified pediatricians provide comprehensive care for newborns, from monitoring growth and development to guiding feeding and nutrition. Visits include age-appropriate vaccinations, developmental milestone tracking, and guidance on sleep, diapering, and other early parenting questions. We also offer free meet-and-greet consultations so you can get to know your pediatrician before your baby arrives.",
      },
      {
        id: "expectant-parents",
        name: "Expectant Parents",
        description: "Prenatal guidance to help new parents prepare before baby arrives.",
        longDescription: "We offer free meet-and-greet consultations for expectant parents, giving you the chance to meet and choose a pediatrician before your baby is born. Once your baby arrives, we coordinate care at partner hospitals and schedule a follow-up visit within 24 to 48 hours of discharge. Our team can also help guide you through insurance enrollment and what to expect at your baby's first pediatric visits.",
      },
      {
        id: "circumcisions",
        name: "Circumcisions",
        description: "Circumcision procedures for newborns and children.",
        longDescription: "We offer circumcision procedures for newborns and children performed by qualified physicians, with anesthesia used to minimize discomfort. Circumcision is a personal decision for every family, and our team is happy to discuss the potential benefits and considerations so you can make the choice that's right for your child. Clear post-procedure care instructions are provided to support healing.",
      },
    ],
  },
  {
    id: "sick-urgent",
    name: "Sick & Urgent Care",
    services: [
      {
        id: "sick-visits",
        name: "Sick Visits",
        description: "Prompt treatment for acute illnesses when your child isn't feeling well.",
        longDescription: "When your child isn't feeling well, our same-day sick visits give you fast access to a pediatrician who can diagnose and treat acute illnesses and minor injuries. Appointments can be scheduled online or by phone, and telehealth options are available for added convenience. Beyond sick visits, our locations also offer vaccinations, sports injury care, and other pediatric services your family may need.",
      },
      {
        id: "same-day-appointments",
        name: "Same-Day Appointments",
        description: "Urgent care made easy with same-day scheduling at most locations.",
        longDescription: "We know that when your child is sick or hurt, timely care matters, which is why we offer same-day appointments at our clinics across Greater LA. You can schedule by phone, online, or through after-hours telehealth, so care is available when you need it most. Same-day scheduling means less time worrying and more time getting your child the attention they need.",
      },
      {
        id: "walk-ins",
        name: "Walk-Ins",
        description: "Unscheduled visits welcome for urgent needs.",
        longDescription: "Walk-in visits are welcome at our clinics for common illnesses, minor injuries, infections, allergies, and other unexpected health concerns. Our pediatricians provide prompt, experienced care without requiring an appointment ahead of time. It's a convenient option for families who need pediatric care right away.",
      },
      {
        id: "telehealth",
        name: "Telehealth",
        description: "Remote medical consultations from wherever your family is.",
        longDescription: "Our telehealth visits let you connect with a board-certified pediatrician remotely through a secure virtual platform, without needing to leave home. Pediatricians can evaluate concerns, offer medical advice, and provide treatment recommendations with the same care and attention as an in-person visit. It's a flexible option for busy families or when getting to a clinic isn't easy.",
      },
      {
        id: "pediatric-infectious-disease",
        name: "Pediatric Infectious Disease",
        description: "Diagnosis and treatment of infections in children.",
        longDescription: "Our pediatricians diagnose and treat a range of infectious diseases in children and teens, working closely with families to build a treatment plan suited to their child's needs. Care spans prevention, diagnosis, and treatment, paired with clear education so families understand their child's condition. Compassionate, collaborative care is at the center of how we approach every case.",
      },
      {
        id: "sports-injuries",
        name: "Sports Injuries",
        description: "Specialized care to get young athletes back in the game safely.",
        longDescription: "Active kids sometimes get hurt, and our board-certified pediatricians offer prompt evaluation and treatment for pediatric sports injuries. With urgent care available seven days a week, in person, online, or via after-hours telehealth, your young athlete can get back in the game safely. Multiple locations across Greater LA make it easy to find care close to home.",
      },
    ],
  },
  {
    id: "behavioral-developmental",
    name: "Behavioral & Developmental Health",
    services: [
      {
        id: "adhd-behavioral-issues",
        name: "ADHD & Behavioral Issues",
        description: "Comprehensive care and support for ADHD and behavioral concerns.",
        longDescription: "We provide comprehensive evaluation, diagnosis, and ongoing management of ADHD and related behavioral concerns in children and teens. Our pediatricians monitor patients regularly, adjusting care as needed, and refer more complex cases to behavioral therapy or psychiatric specialists. Both in-person and telehealth visits are available across our Southern California locations.",
      },
      {
        id: "autism-developmental-disorders",
        name: "Autism & Developmental Disorders",
        description: "Specialized support for children with autism and developmental conditions.",
        longDescription: "Our pediatricians offer specialized evaluation and ongoing management for children with autism and other developmental or behavioral disorders. We coordinate with specialists and schools, reviewing educational documents to help guide families toward the right interventions and support services. Monitoring is tailored to each child's needs, from more frequent visits to periodic check-ins.",
      },
      {
        id: "childhood-obesity-weight-management",
        name: "Childhood Obesity & Weight Management",
        description: "Programs supporting healthy weight and lifestyle habits for the whole family.",
        longDescription: "Developed in partnership with Children's Hospital Los Angeles, our weight management program supports children and families addressing childhood obesity. The program includes monthly monitoring visits (in-person or via telehealth), periodic lab work based on individual risk factors, and weekly educational classes. It's a comprehensive, judgment-free approach to building healthier habits as a family.",
      },
    ],
  },
  {
    id: "specialty-adolescent",
    name: "Specialty & Adolescent Care",
    services: [
      {
        id: "asthma-allergy-center",
        name: "Asthma & Allergy Center",
        description: "Specialized care for respiratory symptoms and allergic conditions.",
        longDescription: "Our Asthma & Allergy Center offers ongoing monitoring and personalized care for children living with asthma or allergies. Depending on your child's needs, we may recommend regular check-ins, medication review, a customized asthma action plan, and asthma education to help manage symptoms day to day. If your child is wheezing, coughing, or has chest tightness, our team can help identify triggers and build a treatment plan that works for your family.",
      },
      {
        id: "allergies",
        name: "Allergies",
        description: "Treatment for a range of childhood allergic conditions.",
        longDescription: "Childhood allergies can show up in many ways, from persistent cold-like symptoms to skin reactions and digestive issues. Our board-certified pediatricians offer testing, allergen avoidance guidance, medication management, and immunotherapy options tailored to your child's needs. With multiple locations across Greater LA, expert allergy care is never far away.",
      },
      {
        id: "adolescent-medicine",
        name: "Adolescent Medicine",
        description: "Healthcare tailored specifically to the needs of teenagers.",
        longDescription: "Adolescence brings its own physical, emotional, and social changes, and our adolescent medicine services are designed specifically for teens and young adults. Care includes physical exams, behavioral health support, preventive care and vaccinations, nutrition guidance, and reproductive health education. Our providers are trained to address the unique needs of this age group across multiple Greater LA locations.",
      },
      {
        id: "teenage-gynecology-menstrual-disorders",
        name: "Teenage Gynecology & Menstrual Disorders",
        description: "Adolescent reproductive health services in a comfortable, confidential setting.",
        longDescription: "We offer gynecological care designed specifically for teenagers, including education about puberty and menstruation, routine exams, and treatment for menstrual irregularities. Early, informed care can help young women make confident, educated choices about their health. Appointments are available online, by phone, or via telehealth, in a setting designed to be comfortable and confidential.",
      },
    ],
  },
];
