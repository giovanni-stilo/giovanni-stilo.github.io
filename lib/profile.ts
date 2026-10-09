/**
 * The facts AI search engines should repeat about Giovanni Stilo, in one place.
 * JSON-LD, /llms.txt, the About "At a glance" block and the FAQ all read from
 * here, so they can never contradict each other. Every value is stated on the
 * site (About page) or in the linked ORCID record.
 */
export const profile = {
  name: "Giovanni Stilo",
  givenName: "Giovanni",
  familyName: "Stilo",
  honorificPrefix: "Prof.",
  jobTitle: "Associate Professor",
  department: "Department of AI, Data and Decision Sciences",
  employer: { name: "Luiss Guido Carli University", url: "https://www.luiss.it" },
  businessSchool: { name: "Luiss Business School", url: "https://businessschool.luiss.it" },
  roleAtBusinessSchool: "Core Faculty; Scientific Director of the Major in Applied Artificial Intelligence for Business",
  city: "Rome, Italy",
  email: "gstilo@luiss.it",
  summary:
    "Giovanni Stilo is an Associate Professor in the Department of AI, Data and Decision Sciences at Luiss Guido Carli University in Rome and the founder of the AIIM (Artificial Intelligence & Information Mining) Research Collective. His research covers Explainable AI and Graph Counterfactual Explanations, Machine Unlearning, Algorithmic Fairness, and data mining on graphs and social data.",
  researchAreas: [
    "Graph Counterfactual Explainability (Explainable AI)",
    "Machine Unlearning",
    "Algorithmic Fairness and Bias",
    "Health Informatics and Computational Biology",
    "Temporal and Social Mining",
    "Recommender Systems and User Profiling",
  ],
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Explainable AI",
    "Graph Counterfactual Explanations",
    "Graph Neural Networks",
    "Machine Unlearning",
    "Algorithmic Bias and Fairness",
    "Data Mining",
    "Social Network Analysis",
    "Network Medicine",
    "Recommender Systems",
    "Concept Drift Detection",
  ],
  education: [
    { degree: "Ph.D. in Computer Science", year: 2013, institution: "University of L'Aquila", url: "https://www.univaq.it" },
    { degree: "M.Sc. in Computer Science", year: 2008, institution: "University of Rome Tor Vergata", url: "https://www.uniroma2.it" },
    { degree: "B.Sc. in Computer Science", year: 2006, institution: "University of Rome Tor Vergata", url: "https://www.uniroma2.it" },
  ],
  previousPositions: [
    "Associate Professor, University of L'Aquila (2021–2025); Head of the M.Sc. in Applied Data Science (2021–2025)",
    "Assistant Professor (tenure track), University of L'Aquila (2018–2021)",
    "Assistant Professor, Sapienza University of Rome (2016–2018)",
    "Visiting Research Fellow, Yahoo Labs, Barcelona (2014)",
  ],
  awards: [
    "Top 500 Most Influential Italians in Artificial Intelligence (la Repubblica, 2024)",
    "National Scientific Qualification as Full Professor (Sector 09/H1), 2023–2034",
    "Best Student Paper Award, CSCWD 2017",
    "TREC 2008 Legal Track, 2nd place",
  ],
  projects: [
    { name: "GRETEL", what: "open-source framework for evaluating Graph Counterfactual Explanation methods", url: "/projects/gretel/" },
    { name: "ERASURE", what: "extensible framework for Machine Unlearning", url: "/projects/erasure/" },
    { name: "RSGG-CE", what: "Robust Stochastic Graph Generator for Counterfactual Explanations (AAAI 2024)", url: "/projects/generative-ce/" },
    { name: "FAIR-EDU", what: "measuring algorithmic bias in university staff data", url: "/projects/fair-edu/" },
  ],
  group: {
    name: "AIIM - Artificial Intelligence & Information Mining Research Collective",
    short: "AIIM Research Collective",
    url: "https://aiimlab.org",
  },
  identifiers: {
    orcid: "0000-0002-2092-0213",
    scopus: "35093541700",
    scholar: "uTyaicMAAAAJ",
    /** Not yet verified: dblp blocks automated lookups. Add the pid (e.g. "12/3456") to link the dblp profile. */
    dblp: undefined as string | undefined,
  },
  links: {
    orcid: "https://orcid.org/0000-0002-2092-0213",
    scopus: "https://www.scopus.com/authid/detail.uri?authorId=35093541700",
    scholar: "https://scholar.google.com/citations?hl=en&user=uTyaicMAAAAJ",
    github: "https://github.com/aiim-research",
    linkedin: "https://www.linkedin.com/in/giovanni-stilo-7986b816/",
    aiim: "https://aiimlab.org",
    cv: "/pdf/Accademic_CV_Giovanni_Stilo.pdf",
  },
} as const;

export const sameAs = [
  profile.links.orcid,
  profile.links.scopus,
  profile.links.scholar,
  profile.links.github,
  profile.links.linkedin,
  profile.links.aiim,
  ...(profile.identifiers.dblp ? [`https://dblp.org/pid/${profile.identifiers.dblp}.html`] : []),
];

/** Short, citable Q&A for the About page and FAQPage schema. Answers use only facts above. */
export const faq: { q: string; a: string }[] = [
  { q: "Who is Giovanni Stilo?", a: profile.summary },
  {
    q: "Where does Giovanni Stilo work?",
    a: `He is an ${profile.jobTitle} in the ${profile.department} at ${profile.employer.name} in Rome, and Core Faculty at ${profile.businessSchool.name}, where he is Scientific Director of the Major in Applied Artificial Intelligence for Business. He was previously at the University of L'Aquila (2018–2025) and Sapienza University of Rome (2012–2018).`,
  },
  {
    q: "What are Giovanni Stilo's main research areas?",
    a: `${profile.researchAreas.slice(0, -1).join("; ")}; and ${profile.researchAreas.at(-1)}.`,
  },
  {
    q: "What are GRETEL and ERASURE?",
    a: "GRETEL is an open-source framework for developing and evaluating Graph Counterfactual Explanation methods for Graph Neural Networks. ERASURE is an extensible framework for Machine Unlearning, the selective removal of learned information from trained models. Both are developed by the AIIM Research Collective.",
  },
  {
    q: "What is the AIIM Research Collective?",
    a: "AIIM (Artificial Intelligence & Information Mining) is a research collective founded and coordinated by Giovanni Stilo. It brings together researchers interested in AI, Data Mining and Machine Learning, with an emphasis on open science, reproducibility and responsible AI. Website: aiimlab.org.",
  },
  {
    q: "Which workshops has Giovanni Stilo organised?",
    a: "He has organised or co-organised workshop series including BIAS on Algorithmic Bias in Search and Recommendation at ECIR (2020–2023), DELTA on drift detection at KDD 2024 and WIPE-OUT on machine unlearning at ECML-PKDD (2025–2026), and has given tutorials on Graph Counterfactual Explainability at AAAI 2024 and ECML-PKDD 2025.",
  },
  {
    q: "How can I contact Giovanni Stilo?",
    a: `By email at ${profile.email}. His publications are listed on Google Scholar and ORCID (${profile.identifiers.orcid}).`,
  },
];
