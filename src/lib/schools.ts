export type SchoolProgram = {
  title: string;
  summary: string;
};

export type School = {
  slug: string;
  name: string;
  short: string;
  tagline: string;
  description: string;
  programs: SchoolProgram[];
  note?: string;
  img: string;
  alt: string;
};

const IMG_SSPP =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDY5ctIx65ZtIdqP1FqBmDc3h6mRL-eDELPU01qJxTiwveZ7Qkc0JUOITaYK34Gjvoh1U8e_5OsnXMVmm1if7YwWlWAyE4QiroRiTIG-0LI5f7Q6UAH4dTwbJQ1vwXZTjaiEZoHucuwkkX2Qej7PLvUVkfqPkiWXWQlt08XHivQ7ZIuh4l8W8AYmEtAgHfz5Dln5pdXbpIR_alVu9IFOQnYNyQ9otIv4HI8Mko6BuIsD6ySqwP_Rch5";
const IMG_COMMUNITY =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAiRc28byUdcEH6fvY8D8hoac2QQ_O5wz9o2661oZl4I_OP9blSyjUGfG__pLDmmW6_ZC523MpwU6Z6qzbhXCGBhQj-k5EiJ5d8QWgZdwEfdDCTlvP7redXAslOpmmdm81hY4GS4NEK8dtThiXZx_6uAobtYF7zZnPeupf1j0Dy6SP_RxR_pULBVic6BWInE7zX9Tn90ZI8EJZFYyBAbWMnVzuiuWzdWKwk67f6npoz15u3RGomPgIN";
const IMG_LAB =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAQeIkf9aHSKXhWqDjLZQ9lM1NWJjHL9kT5FUQJso5gazaDvqdYPIKG8oo9cPdNs9xUxMgcvg78LmQxjGfEmO2ivn6LkFGlCBcaeBbUaObSQEtwvXnERhen5AdF-4RIAh5P3gpHj0_nY2Pe1iRQSn97p4xW1wf7WAl4K3yxscPSZ4yfY--G2WM38dmC5hiQSa0JVHfC_6_Cq07oKb90ilcTlv3_EitIaekurlX-TX1mkIxyc_dQ-gbu";
const IMG_CAMPUS =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAM-waeanp_o5N487YJJUt3AiBPV_Ml3c1fjDt8iRmsP4i20FKuwf1FPxrRsYnWphxJfjif5jDaL65Vg2qSfbYPSfrpf0pNhIeqzUFBZcanlIMdSsvf4KQv0IbI-5ZR0ibHLqXpTDEcZqGN00p_z83ZmsMKurDFdTd9_aIXp6CerFdpqeU3PKt7Tb85TXl7HupWsHRGI48qCynUnq4brw3Lo3rDekbUomV4gskFzwRfvXpaaDMacHv4";

export const SCHOOL_LIST: School[] = [
  {
    slug: "sspp",
    name: "School of Sustainable Professional Practice",
    short: "Sustainable Professional Practice",
    tagline: "Professional Pathways",
    description:
      "S-STC's Professional Sustainability Pathways bridge the gap between academic qualifications and the sustainability competencies required in today's workplaces, helping organisations achieve their sustainability commitments.",
    programs: [],
    note: "Programmes are being finalised and will be published shortly.",
    img: IMG_SSPP,
    alt: "Professionals in a collaborative workshop around sustainable materials",
  },
  {
    slug: "sustainable-skills-technologies",
    name: "School of Sustainable Skills & Technologies",
    short: "Sustainable Skills & Technologies",
    tagline: "Hands-On Green Making",
    description:
      "Practical, workshop-based training in green making and appropriate technology — turning waste streams and local materials into products, income and low-carbon livelihoods.",
    programs: [
      {
        title: "Upcycled Textile Accessories",
        summary:
          "Turn textile waste into market-ready bags, accessories and homeware using circular design, sorting, cutting and finishing techniques.",
      },
      {
        title: "Eco Footwear",
        summary:
          "Design and craft footwear from reclaimed, plant-based and low-impact materials, with pattern making, assembly and quality finishing.",
      },
      {
        title: "Solar Dryer Assembling",
        summary:
          "Build, install and maintain solar dryers for food preservation — sizing, airflow, materials, assembly and post-harvest handling.",
      },
      {
        title: "Weave Making",
        summary:
          "Traditional and contemporary weaving with natural and recovered fibres, from preparation and loom work to product development.",
      },
      {
        title: "Sustainable Packaging",
        summary:
          "Develop packaging that protects products and the planet — material selection, reuse and refill formats, labelling and compliance.",
      },
    ],
    img: IMG_COMMUNITY,
    alt: "Artisans working with recovered materials in a craft workshop",
  },
  {
    slug: "digital-literacy",
    name: "School of Digital Literacy",
    short: "Digital Literacy",
    tagline: "Digital Confidence",
    description:
      "Everyday digital competence for learners, workers and enterprises — devices, productivity tools, online safety, digital communication and using technology to grow a livelihood.",
    programs: [],
    note: "Programme details are being finalised and will be published shortly.",
    img: IMG_LAB,
    alt: "Learners working on laptops in a bright training room",
  },
  {
    slug: "transitional-skills",
    name: "School of Transitional Skills",
    short: "Transitional Skills",
    tagline: "Skills for a Just Transition",
    description:
      "Support for people moving between roles, sectors or livelihoods as the economy greens — reskilling, enterprise basics and the workplace competencies a just transition demands.",
    programs: [],
    note: "Programme details are being finalised and will be published shortly.",
    img: IMG_CAMPUS,
    alt: "A mentor guiding a small group through a practical training session",
  },
];

export const SCHOOL_NAMES = SCHOOL_LIST.map((s) => s.name);

export const SERVICES = [
  {
    slug: "readers-community-library",
    name: "Readers Community Library",
    summary:
      "A physical library that serves the reading needs of the host community — open shelves, study space and reading programmes for learners of every age.",
    img: IMG_LAB,
    alt: "Reading room with shelves of books and natural light",
  },
  {
    slug: "discovery-excursions",
    name: "Discovery Excursions",
    summary:
      "Guided field trips that explore the social, economic and environmental gems of the Western block, connecting learners with real places, enterprises and ecosystems.",
    img: IMG_CAMPUS,
    alt: "Group on a guided field excursion through a green landscape",
  },
] as const;
