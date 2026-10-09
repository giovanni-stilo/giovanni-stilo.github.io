export const site = {
  title: "Prof. Giovanni Stilo",
  description:
    "Professor of Computer Science at Luiss University of Rome. Expert in Artificial Intelligence, Machine Learning, Explainable AI, Graph Counterfactual Explanations, Machine Unlearning, and Algorithmic Fairness.",
  url: "https://giovannistilo.eu",
  author: "Giovanni Stilo",
  lang: "en",
  logo: "/assets/img/profile.jpeg",
  twitter: "@giovannistilo",
  gaId: "G-8MEB62J7WB",
  social: [
    "https://scholar.google.com/citations?hl=en&user=uTyaicMAAAAJ",
    "https://www.linkedin.com/in/giovanni-stilo-7986b816/",
    "https://github.com/aiim-research",
  ],
} as const;

export const absoluteUrl = (path: string) => new URL(path, site.url).toString();

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "About" },
  { href: "/research/", label: "Research" },
  { href: "/publications/", label: "Publications" },
  { href: "/teaching/", label: "Teaching" },
  { href: "/people/", label: "People" },
  { href: "/events/", label: "Events" },
  { href: "/service/", label: "Service" },
  { href: "/news/", label: "News" },
  { href: "/blog/", label: "Blog" },
] as const;
