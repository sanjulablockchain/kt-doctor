export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    id: "first-visit",
    question: "What should I bring to my child's first visit?",
    answer:
      "Please bring your child's insurance card, a valid photo ID, any previous medical records or immunization history, and a list of current medications. For newborns, bring the hospital discharge paperwork. Arriving 15 minutes early helps us get your paperwork completed smoothly.",
  },
  {
    id: "walk-ins",
    question: "Do you accept walk-in patients?",
    answer:
      "Yes! We welcome walk-in patients at all of our 24 clinic locations during regular business hours (Mon–Fri, 9AM–6PM). Same-day appointments are also available — you can book online in under a minute or call us directly. Wait times for walk-ins are typically under 30 minutes.",
  },
  {
    id: "insurance-plans",
    question: "What insurance plans do you accept?",
    answer:
      "We accept all major insurance plans including HMO, PPO, Medi-Cal, LA Care, Molina Healthcare, Blue Shield, Healthnet, Anthem, Optum, and Regal Medical Group. Coverage is never a barrier to care at our clinics. If you're unsure about your plan, call us and we'll verify your coverage.",
  },
  {
    id: "ages-treated",
    question: "What ages do you treat?",
    answer:
      "Kids & Teens Medical Group provides care for patients from birth through age 21. This includes newborns, infants, toddlers, school-age children, adolescents, and young adults. Our St. Gianna Medical Group locations also offer family practice for patients of all ages.",
  },
  {
    id: "telehealth",
    question: "How does telehealth work?",
    answer:
      "Our telehealth service connects you with your trusted KTMG pediatrician via secure video call. Available Mon–Sat 9AM–9PM and Sundays 12PM–6PM. Simply book online, and you'll receive a link to join your video visit. Your doctor can diagnose, prescribe medications, and send prescriptions directly to your pharmacy — all from the comfort of home.",
  },
  {
    id: "switch-doctor",
    question: "Can I switch my child's doctor within the network?",
    answer:
      "Absolutely. With 89+ providers across 24 locations, you can switch pediatricians at any time. Your child's medical records are centralized and accessible from any KTMG clinic, so there's no paperwork or delays when transitioning to a new provider.",
  },
  {
    id: "after-hours",
    question: "Do you offer after-hours and weekend care?",
    answer:
      "Yes. Our Pediatric After Hours clinics provide evening and weekend urgent care staffed by board-certified pediatricians. Telehealth is also available 7 days a week, including evenings (until 9PM Mon–Sat) and Sundays (12PM–6PM). Your child can always be seen when they need care.",
  },
  {
    id: "transfer-hmo",
    question: "How do I transfer from another HMO/IPA?",
    answer:
      "Through our Serendib Healthways HMO/IPA, transferring is hassle-free. Our transfer team handles all the paperwork for you. Simply call (626) 655-4041 or visit serendibhealthways.com to schedule a call with our transfer team. The switch can happen immediately in most cases.",
  },
];
