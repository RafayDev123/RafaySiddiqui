// Central, editable configuration for personal/site data.
// Update this file to change contact info, socials, nav, and copy across the whole site.

export const siteConfig = {
  name: "Rafay Siddiqui",
  initials: "RS",
  role: "Frontend Developer",
  location: "Hyderabad, Pakistan",
  email: "rafaysiddiqui713@gmail.com",
  phone: "03138345518",
  availability: "Available for freelance",
  headline: "Frontend and web developer building modern, AI-assisted web products.",
  subhead:
    "I’m Rafay Siddiqui, a frontend and web developer in Hyderabad, Pakistan, building responsive websites and web apps with React, Next.js, and TypeScript.",
  taglineShort: "Design to code. Frontend engineering. AI assisted delivery.",
  social: {
    github: "https://github.com/RafayDev123/",
    linkedin: "https://www.linkedin.com/in/muhmmadrafay/",
    email: "mailto:rafaysiddiqui713@gmail.com",
    whatsapp: "https://wa.me/923138345518",
  },
  // No resume file has been supplied yet — keep this as an editable placeholder.
  // When a Resume.pdf is added to /public, set resumeUrl to "/Rafay-Siddiqui-Resume.pdf".
  resumeUrl: null as string | null,
  nav: [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Experience", id: "experience" },
    { label: "Stack", id: "stack" },
    { label: "Contact", id: "contact" },
  ],
  year: new Date().getFullYear(),
};

export const experience = [
  {
    company: "Sidz Solution",
    role: "Frontend Developer",
    period: "June 2023 to Present",
    location: "Hyderabad, Pakistan",
    summary:
      "Building client facing frontend interfaces end to end from Figma handoff to responsive, production-ready pages.",
    points: [
      "Built responsive, cross browser web interfaces for client facing projects using HTML5, CSS3, JavaScript, and Bootstrap.",
      "Converted Figma and UI/UX designs into pixel perfect, production ready pages.",
      "Maintained visual and functional fidelity across responsive breakpoints.",
      "Collaborated with designers and teammates to improve layout structure, usability, and page performance.",
      "Wrote clean, maintainable frontend code.",
      "Continued developing skills in React and modern JavaScript tooling.",
    ],
  },
];

export type SkillCategory = {
  title: string;
  description: string;
  items: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    description: "Core languages and frameworks I build with daily.",
    items: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React.js", "Next.js"],
  },
  {
    title: "Styling & UI",
    description: "Systems I use to turn design files into real interfaces.",
    items: ["Tailwind CSS", "Bootstrap", "Material UI", "Responsive Design"],
  },
  {
    title: "Motion",
    description: "For interaction and scroll driven storytelling.",
    items: ["GSAP"],
  },
  {
    title: "Backend & Services",
    description: "Enough to wire a frontend to real data.",
    items: ["Firebase", "Supabase", "REST APIs"],
  },
  {
    title: "Tools & Workflow",
    description: "How designs and code actually get shipped.",
    items: ["Git", "GitHub", "Figma"],
  },
  {
    title: "AI Powered Development",
    description: "An active focus, not a side note.",
    items: [
      "Generative AI Tools",
      "AI Agents",
      "Chatbot Development",
      "AI-assisted Coding",
    ],
  },
];

export const services = [
  {
    title: "Website Design & Development",
    description:
      "Responsive frontend builds and Figma to code implementation using React, Next.js and modern CSS.",
    items: [
      "Responsive frontend development",
      "React / Next.js interfaces",
      "Figma to code implementation",
    ],
  },
  {
    title: "AI & Automation",
    description:
      "Applying generative AI tooling and agents to build practical, working features not just demos.",
    items: ["Chatbots", "AI powered tools", "Workflow automation"],
  },
  {
    title: "Modern AI Assisted Development",
    description:
      "Using AI assisted coding to prototype and iterate faster without cutting corners on the final build.",
    items: [
      "Rapid prototyping",
      "AI assisted coding",
      "Production minded implementation",
    ],
  },
];
