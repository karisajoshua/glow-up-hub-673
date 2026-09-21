export type MasterclassKey = "green-job-readiness" | "digital-career-compass";

export const MASTERCLASS = {
  key: "green-job-readiness" as MasterclassKey,
  title: "Green Job Readiness Masterclass",
  tagline: "Building the skills, evidence and professional profile employers want in the green economy.",
  quote:
    "From \u201CI want a green job\u201D to \u201CI can demonstrate that I am ready for one.\u201D",
  facilitator: {
    name: "Eunice Barasa",
    role: "Sustainability Advocate | Development Practitioner",
    phone: "+254 739775180",
  },
  whatsappNumber: "254739775180",
  date: "Saturday 26th September",
  time: "9:00 am \u2013 12:00 pm",
  venue: "Virtual (Google Meet)",
  fee: "KSh 500",
  gains: [
    {
      icon: "insights",
      title: "Understand the green job market",
      body: "Where the roles are, which sectors are hiring and how the green economy is reshaping careers in Kenya and beyond.",
    },
    {
      icon: "visibility",
      title: "What employers actually look for",
      body: "The evidence, language and proof points hiring managers use to separate interest from readiness.",
    },
    {
      icon: "eco",
      title: "4 key green skills + transferable skills",
      body: "The core green competencies to build, and how to reframe the experience you already have.",
    },
    {
      icon: "badge",
      title: "Build your CV and professional profile",
      body: "Practical work on your CV, LinkedIn and portfolio so your profile reads green-job ready.",
    },
  ],
};

export const DIGITAL_CAREER_COMPASS = {
  key: "digital-career-compass" as MasterclassKey,
  title: "The Digital Career Compass Masterclass",
  intro: [
    "Do you have a passion in a digital-oriented career path, or is your line of work inclined towards digital proficiency, but you just do not know where to start? We have you covered!",
    "The Digital Career Compass Masterclass, delivered by an industry expert, will melt away all confusion and expertly point to current in-demand and must-have skills and their relevance in the green economy and job creation.",
  ],
  points: [
    {
      icon: "category",
      title: "Explore digital career pathways",
      body: "Understand opportunities in software development, data, cybersecurity, digital media, marketing, e-commerce, cloud computing and green technology.",
    },
    {
      icon: "explore",
      title: "Choose a suitable direction",
      body: "Match your interests, strengths and goals with the right course, skills and career pathway.",
    },
    {
      icon: "work",
      title: "Build employability and income",
      body: "Learn how to create a portfolio, gain practical experience, secure work, freelance or offer digital services to clients.",
    },
    {
      icon: "eco",
      title: "Develop green digital skills",
      body: "Understand how digital products affect carbon emissions and learn to design, use and manage technology in ways that improve efficiency, reduce energy consumption and support sustainable solutions.",
    },
  ],
  date: "2 October 2026",
  time: "9:00 \u2013 12:00",
  venue: "Google Meet",
  fee: "KSh 500",
  whatsappNumber: "254739775180",
  facilitator: {
    name: "S-STC",
    phone: "+254 739775180",
  },
} as const;

export const UPCOMING_MASTERCLASSES = [
  {
    title: "Transitional Skills",
    subtitle: "Preparing for work and life",
    body: "A practical masterclass for people moving between roles, sectors or livelihoods as the economy greens \u2014 the mindset, workplace habits and skills a just transition demands.",
    icon: "swap_horiz",
  },
] as const;

export const HEARD_ABOUT_OPTIONS = [
  "Website",
  "WhatsApp",
  "Social media",
  "Friend or colleague",
  "Employer",
  "Event or workshop",
  "Other",
] as const;
