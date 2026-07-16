export type StorySection = {
  heading: string;
  body: string;
};

export type Story = {
  id: string;
  title: string;
  date: string;
  author?: string;
  imageSrc: string;
  excerpt: string;
  sections: StorySection[];
};

export const stories: Story[] = [
  {
    id: "autism-awareness-month",
    title:
      "Supporting Our Young Patients: Celebrating Autism Awareness Month in Pediatric Care",
    date: "April 5, 2024",
    imageSrc: "/blog-autism-awareness-month.png",
    excerpt:
      "Kids & Teens Medical Group joins the global community each April in recognizing Autism Awareness Month, reflecting on how pediatric care can better support children with autism and their families.",
    sections: [
      {
        heading: "Understanding Autism Spectrum Disorder",
        body: "Autism Spectrum Disorder (ASD) is a developmental condition that affects communication, social interaction, and behavior, with a wide range of presentations and needs from child to child.",
      },
      {
        heading: "Supporting Children with Autism and Their Families",
        body: "As pediatric providers, we aim to create a welcoming, supportive environment through individualized care, sensory-friendly spaces, clear communication, collaboration with specialists and schools, and ongoing support and resources for families.",
      },
      {
        heading: "Raising Awareness",
        body: "Autism Awareness Month is an opportunity for pediatric practices to educate staff, engage with the local community through outreach and events, and empower children with autism and their families to advocate for their needs.",
      },
    ],
  },
  {
    id: "breathe-easy-this-winter",
    title: "Breathe Easy This Winter: Simple Steps to Protect Your Child from Asthma",
    date: "December 13, 2023",
    author: "Dr. Janesri De Silva",
    imageSrc: "/blog-breathe-easy-this-winter.png",
    excerpt:
      "Winter weather can be tough on kids with asthma. Dr. Janesri De Silva shares practical, real-world steps families can take to keep symptoms under control through the colder months.",
    sections: [
      {
        heading: "Cold Air Precautions",
        body: "Cold winter air can trigger asthma symptoms, so it helps to have your child wear a scarf or mask outdoors, limit time in especially cold weather, and keep an eye on local air quality.",
      },
      {
        heading: "Indoor Air Quality",
        body: "What's in the air at home matters too. Keeping the house clean, avoiding smoke exposure, maintaining humidity between 30 and 50 percent, and using a HEPA filter can all help cut down on common indoor triggers like dust and allergens.",
      },
      {
        heading: "Regular Asthma Check-ups",
        body: "Even when symptoms feel well controlled, regular visits let your pediatrician adjust medications and offer personalized guidance for the winter months.",
      },
      {
        heading: "Flu Vaccination",
        body: "An annual flu shot is especially important for children with asthma, since the flu can make respiratory symptoms worse and raise the risk of a serious asthma flare-up.",
      },
      {
        heading: "Additional Tips for Parents",
        body: "It helps to know your child's specific triggers, have an asthma action plan in place with your pediatrician, talk with your child about their condition in an age-appropriate way, and always keep rescue medication on hand.",
      },
    ],
  },
  {
    id: "halloween-safety-tips",
    title: "Halloween Safety Tips for Parents",
    date: "October 21, 2023",
    author: "Dr. Janesri De Silva",
    imageSrc: "/blog-halloween-safety-tips.png",
    excerpt:
      "Halloween is one of the most exciting nights of the year for kids. A little planning around bedtime, costumes, and candy can help make it a safe one too.",
    sections: [
      {
        heading: "Set a Bedtime and Plan Ahead",
        body: "Talk with your kids about bedtime expectations ahead of time, since Halloween excitement can easily throw off routines.",
      },
      {
        heading: "Safety for Older Kids",
        body: "For kids trick-or-treating without direct supervision, set clear boundaries on where they can go, have them carry a flashlight or wear glow-in-the-dark gear, remind them to use crosswalks, and encourage them to stick together in a group.",
      },
      {
        heading: "Candy Rules",
        body: "Set expectations for how much candy is okay to eat that night, check treats for any open wrappers or signs of tampering, and make sure kids know not to eat anything unwrapped or homemade from someone they don't know.",
      },
      {
        heading: "Costume Safety",
        body: "Choose flame-resistant costumes, add reflective tape or glowsticks for visibility after dark, and skip masks or costumes that make it hard to see or move comfortably.",
      },
      {
        heading: "Planning Ahead",
        body: "Plan costumes early to avoid last-minute stress, use non-toxic, skin-friendly makeup, and double check that your child can see and move well in their costume.",
      },
      {
        heading: "Encourage Communication",
        body: "Keep the conversation open with your kids about Halloween so you can address any worries and set expectations together.",
      },
      {
        heading: "Alternatives to Trick-or-Treating",
        body: "If trick-or-treating isn't the right fit this year, a movie night, an arts and crafts project, or decorating the house and handing out treats at home can be just as fun.",
      },
      {
        heading: "Enjoy the Precious Time Together",
        body: "Whatever you choose to do, Halloween is a great chance to spend quality time together as a family.",
      },
    ],
  },
  {
    id: "er-vs-urgent-care",
    title: "The Difference between Pediatric Emergency Room & Urgent Care in California",
    date: "August 23, 2023",
    imageSrc: "/blog-er-vs-urgent-care.png",
    excerpt:
      "Knowing whether to head to the pediatric ER or an urgent care center can make all the difference when your child needs care fast. Here's how to tell which is right for the moment.",
    sections: [
      {
        heading: "Understanding Pediatric Emergency Rooms",
        body: "Pediatric ERs are built for severe, life-threatening conditions that need immediate, intensive care, staffed by pediatric specialists with access to advanced equipment for cases like serious injuries, breathing difficulties, or seizures.",
      },
      {
        heading: "Exploring Urgent Care Centers",
        body: "Urgent care centers handle non-critical situations that still need prompt attention, like minor cuts, sprains, moderate infections, or a mild fever.",
      },
      {
        heading: "When to Choose the Emergency Room",
        body: "Head straight to the ER for anything potentially life-threatening, such as severe burns, head injuries, severe allergic reactions, or trouble breathing.",
      },
      {
        heading: "When to Opt for Urgent Care",
        body: "Urgent care is a great fit for non-severe needs outside regular office hours, like ear infections or minor fractures, usually with shorter wait times than the ER.",
      },
      {
        heading: "Staff Qualifications and Facilities",
        body: "Pediatric ERs are staffed by pediatricians and pediatric nurses with advanced diagnostic and treatment equipment, while urgent care centers have qualified medical staff and more basic capabilities suited to non-emergent care.",
      },
      {
        heading: "Cost and Wait Times",
        body: "Urgent care tends to be a more cost-effective option with shorter wait times for non-life-threatening issues, while ERs prioritize by severity of condition.",
      },
      {
        heading: "Choosing the Right Option",
        body: "When in doubt, let the severity of the situation guide you: life-threatening conditions belong in the ER, while non-emergent urgent needs are well suited to urgent care.",
      },
    ],
  },
];
